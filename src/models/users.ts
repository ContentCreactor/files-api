import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
});

const Users = mongoose.model('Users', UserSchema);

export default Users