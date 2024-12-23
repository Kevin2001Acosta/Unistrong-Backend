const errorHandler = (err, req, res, next) => {
    // Determina el código de estado, si no lo tiene, asigna un 500
    const statusCode = err.status || 500;
    // Devuelve el mensaje de error en la respuesta JSON
    res.status(statusCode).json({
        status: statusCode,
        message: err.message || "Ocurrió un error interno en el servidor",
    });
};
export default errorHandler;
