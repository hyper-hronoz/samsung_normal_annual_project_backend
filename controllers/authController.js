const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require('path');

const {

    secret
} = require('../config');
const { Http2ServerRequest } = require("http2");

const generateAccessToken = (id) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, secret, {
        expiresIn: "2160h"
    })
}

class AuthController {

    async registration(req, res) {
        try {
            console.log(req.body)

            let {
                username,
                password,
                email,
                gender,
            } = req.body;

            password = bcrypt.hashSync(password, 7);

            const checkUserWithSameEmail = await User.findOne({
                email
            })

            console.log("Checking user with same email", checkUserWithSameEmail)

            if (checkUserWithSameEmail) {

                if (checkUserWithSameEmail.email == email && checkUserWithSameEmail.isEmailConfirmed) {
                    console.log("User already exists")
                    return res.status(422).json({
                        message: "User with this email already exists"
                    });
                }

                if (checkUserWithSameEmail.email == email && !checkUserWithSameEmail.isEmailConfirmed) {
                    await User.deleteOne({
                        email
                    });
                    console.log("User has been deleted")
                }

            }

            const user = new User({
                username,
                password,
                email,
                gender,
                isEmailConfirmed: false,
            })

            await user.save()

            const controller = new AuthController();

            await controller.sendConfirmationEmail(req, res);

        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "auth failed internal server error"
            })
        }
    }

    async login(req, res) {
        try {
            console.log(req.body)

            const {
                email,
                password
            } = req.body

            const user = await User.findOne({
                email
            })

            if (!user) {
                console.log("Пользователя не существует");
                return res.status(404).json({
                    message: `Пользователь c ${email} не найден`
                })
            }

            if (!user.isEmailConfirmed) {
                console.log("Пользователь не подтвержден");
                return res.status(403).json({
                    message: "Email is not confirmed, please confirm it"
                })
            }

            const isValidPassword = bcrypt.compareSync(password, user.password)

            if (!isValidPassword) {
                console.log("Введен не верный пароль");
                return res.status(400).json({
                    message: `Введен неверный пароль`
                })
            }

            const token = generateAccessToken(user._id)

            console.log(token)

            return res.status(200).json({
                token
            })

        } catch (e) {
            console.log(e)

            res.status(500).json({
                message: 'Login error'
            })
        }
    }

    async confirmEmail(req, res) {
        try {
            const token = req.params.token;

            const email = jwt.verify(token, secret).email;

            if (!email) {
                return res.status(400).json({
                    message: "incorret confirmation"
                })
            }

            const user = await User.findOne({
                email
            })

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            if (!user.isEmailConfirmed) {
                console.log("Обновляем статус аккаунта");
                await User.updateOne({
                    email
                }, {
                    isEmailConfirmed: true
                })
            }

            return res.send(await ejs.renderFile(path.join(__dirname, "..", "/public/email_confirmed_congratulations.ejs")))

        } catch (e) {
            console.error(e)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async sendConfirmationEmail(req, res) {
        try {
            console.log("Sending confirmation email");

            console.log(req.body)

            const {
                email
            } = req.body

            const user = await User.findOne({
                email
            })

            if (!user) {
                console.log("Странно но юзер не найден");
                return res.status(404).message({
                    message: "User not found"
                })
            }

            if (user.isEmailConfirmed) {
                console.log("Емайл подтвержден");
                return res.status(409).json({
                    message: "Email already confirmed"
                })
            }

            if (!user.email) {
                console.log("оказалось у пользователя нет email");
                return res.status(409).json({
                    message: "Как так можно было устроить я хз, регайся заново"
                })
            }

            const jwtConfirmationLink = await jwt.sign({
                email
            }, secret, {
                expiresIn: "12h"
            });

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "nodemailertest228@gmail.com",
                    pass: "12345678;jgf",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const host = req.get('host');

            const data = await ejs.renderFile(path.join(__dirname, "..", "/public/email_template.ejs"), { confirmationLink: `http://${host}/auth/confirm/${jwtConfirmationLink}`});

            console.log(email);

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻"', // sender address
                to: email, // list of receivers
                subject: "Email confirmation ✔", // Subject line
                text: "Please confirm email to get access to application", // plain text body
                html: data, // html body
            });

            console.log("Message sent: %s", info.messageId);

            console.log("Sending email finished...");

            await res.status(200).json({
                message: "User successfull created and email sent"
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                message: "Email confirmation failed internal server error"
            })
        }
    }

    async validateToken(req, res) {
        return res.sendStatus(200)
    }
}

module.exports = new AuthController();