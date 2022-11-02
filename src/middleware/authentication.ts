import Session from "../models/session"

export const authenticator = async (req: any, res: any, next: any) => {
    // if this request doesn't have any cookies, that means it isn't
    // authenticated. Return an error code.
    console.log('cookie is', req.cookies)

    if (!req.cookies) {
        res.status(401).end()
        return
    }

    // We can obtain the session token from the requests cookies, which come with every request
    const sessionToken = req.cookies.session
    if (!sessionToken) {
        // If the cookie is not set, return an unauthorized status
        res.status(401).end()
        return
    }

    // We then get the session of the user from our session map
    // that we set in the signinHandler
    const userSession: any = await Session.findOne({token: sessionToken})

    if (!userSession) {
        // If the session token is not present in session map, return an unauthorized error
        res.status(401).end()
        return
    }
    // if the session has expired, return an unauthorized error, and delete the 
    // session from our map
    const isExpired = userSession.expiresAt < new Date()

    if (isExpired) {
        //delete sessions[sessionToken]
        res.status(401).end()
        return
    }

    // If all checks have passed, we can consider the user authenticated and
    // send a welcome message
    req.context.user = userSession.username
    next()
}