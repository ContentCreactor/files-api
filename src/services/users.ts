import bcrypt from 'bcrypt'

export const hashNewPassword = ({ plaintextPassword }: { plaintextPassword: string }) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(plaintextPassword, salt);

    return { hashedPassword, salt }
}

export const calculateHash = ({ plaintextPassword, salt }: { plaintextPassword: string, salt: string }) => {
    const hash = bcrypt.hashSync(plaintextPassword, salt);

    return hash
}