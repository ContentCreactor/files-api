export const Me = async (request: any, response: any) => {
    return response.status(200).json({
        user: request.context.user,
    });
};