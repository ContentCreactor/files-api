import Users from "./models/users";
import { calculateHash, hashNewPassword } from "./services/users";

export const GetFiles = (request: any, response: any) => {
    const data = [
        { Key: 'foo1.file', Size: 1, LastModified: new Date('2000-01-01 00:00:00 +0000') },
        { Key: 'foo2/bar1.file', Size: 2, LastModified: new Date('2000-01-01 00:00:01 +0000') },
        { Key: 'foo2/bar2/baz1.file', Size: 3, LastModified: new Date('2000-01-01 00:00:02 +0000') },
        { Key: 'foo2/bar2/baz2.file', Size: 4, LastModified: new Date('2000-01-01 00:00:00 +0000') },
        { Key: 'foo2/bar3/baz3.file', Size: 5, LastModified: new Date('2000-01-01 00:00:01 +0000') },
    ];

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


        // !!!!!!!!!!TODO: create session and set cookie later

        response.status(200).json({
            message: 'login success',
        });
    } catch (err) {
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
            response.status(400).json({
                status: 'fail',
                message: 'username and password is required'
            });
        }

        const existingUser = await Users.find({ username });

        if (existingUser.length > 0) {
            response.status(400).json({
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

        response.status(200).json({
            status: 'account created success',
        });
    } catch (err) {
        console.error('error creating user', err)

        response.status(404).json({
            status: 'fail',
        });
    }
};