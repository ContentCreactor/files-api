import Users from "./models/users";
import { calculateHash, hashNewPassword } from "./services/users";
import { uuid } from 'uuidv4';
import Session from "./models/session";
import dayjs from "dayjs";

export const GetFiles = (request: any, response: any) => {
    const data = [
        { Key: 'foo1.file', Size: 1, LastModified: new Date('2000-01-01 00:00:00 +0000') },
        { Key: 'foo2/bar1.file', Size: 2, LastModified: new Date('2000-01-01 00:00:01 +0000') },
        { Key: 'foo2/bar2/baz1.file', Size: 3, LastModified: new Date('2000-01-01 00:00:02 +0000') },
        { Key: 'foo2/bar2/baz2.file', Size: 4, LastModified: new Date('2000-01-01 00:00:00 +0000') },
        { Key: 'foo2/bar3/baz3.file', Size: 5, LastModified: new Date('2000-01-01 00:00:01 +0000') },
    ];

    console.log('asd,', process.env.NODE_ENV)


    response.send(data);
};

export const Login = async (request: any, response: any) => {
    try {
        const {
            password,
            username
        } = request.body

        if (!password || !username) {
            response.status(400).json({
                message: 'invalid credentials',
            });
        }

        const user = await Users.findOne({
            username: username.toLowerCase(),
        });


        const hashedUserPass = calculateHash({ plaintextPassword: password, salt: user.salt })

        if (hashedUserPass !== user.password) {
            response.status(400).json({
                message: 'invalid credentials',
            });
        }

        console.log('user was good')

        // !!!!!!!!!!TODO: create session and set cookie later

        // generate a random UUID as the session token
        const sessionToken = uuid()

        // set the expiry time as 120s after the current time
        const now = new Date()
        const expiresAt = new Date(+now + 120 * 1000)

        // create a session containing information about the user and expiry time

        const userSession = await Session.create({
            userId: user.id,
            username,
            expiresAt,
            token: sessionToken,
        });

        // In the response, set a cookie on the client with the name "session_cookie"
        // and the value as the UUID we generated. We also set the expiry time

        response.cookie("session", sessionToken, {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            sameSite: 'strict',
            expires: dayjs().add(30, "days").toDate(),
        });


        response.status(200).json({
            message: 'login success',
            username,
        });
    } catch (err) {
        console.log('err', err)
        response.status(404).json({
            status: 'fail',
        });
    }
};

export const Register = async (request: any, response: any) => {
    try {
        const {
            email,
            password,
            username
        } = request.body

        if (!password || !username) {
           return  response.status(400).json({
                status: 'fail',
                message: 'username and password is required'
            });
        }

        console.log('finding existing users')

        const existingUser = await Users.find({ username });
        console.log('foud existing users', existingUser)

        if (existingUser.length > 0) {
            return response.status(400).json({
                status: 'fail',
                message: 'username is already registered'
            });
        }

        const { hashedPassword, salt } = hashNewPassword({ plaintextPassword: password })

        const newUser = await Users.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            salt,
            username: username.toLowerCase(),
        });

        return  response.status(200).json({
            status: 'account created success',
        });
    } catch (err) {
        console.error('error creating user', err)

        return response.status(404).json({
            status: 'fail',
        });
    }
};

export const Auth = async (request: any, response: any) => {
    try {
        console.log('returning userd', request.context.user)
        response.status(200).json({
            username: request.context.user,
        });
    } catch (err) {
        console.error('error creating user', err)

        response.status(404).json({
            status: 'fail',
        });
    }
};