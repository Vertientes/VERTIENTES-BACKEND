    // Funcion para dar un token de autenticacion al usuario
    export const sendTokenResponse = async (user, codeStatus, res) => {
        const token = user.getJwtToken()
        res.status(codeStatus).json({
            success: true,
            token,
            user
        })
    }