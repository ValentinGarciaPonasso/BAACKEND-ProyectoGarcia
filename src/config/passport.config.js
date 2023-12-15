import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utilitis.js";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";
import "dotenv/config.js"

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age} = req.body;

                try {
                    let user = await userModel.findOne({ email: username });
                    if (user) {
                        console.log("Usuario ya existe");
                        return done(null, false);
                    }
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    let result = await userModel.create(newUser);
                    return done(null, result);
                } catch (error) {
                    return done("Error al obtener usuario" + error);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    let user = await userModel.findOne({ email: username });
                    if (!user) {
                        console.log("Usuario no existe ");
                        return done(null, false);
                    }

                    if (!isValidPassword(user, password)) return done(null, false);

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: process.env.gitclientid,
                clientSecret: process.env.glitclientsecret,
                callbackURL: process.env.gitcallbackurl
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);
                    let user = await userModel.findOne({ email: profile._json.email });     ///traemos el user
                    if (!user) {                                                             /// si no existe lo creamos
                        let newUser = {
                            first_name: profile._json.name,
                            last_name: "GihubNull",
                            email: profile._json.email,
                            age: 9999,
                            password: "",
                        };
                        let result = await userModel.create(newUser);
                        console.log("Resultado: " + result);
                        done(null, result);
                    } else {
                        console.log("Usuario: " + user);
                        done(null, user);                                                       /// si existe lo devolvemos
                    };
                } catch (err) {
                    done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        console.log(user._id);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};


export default initializePassport;