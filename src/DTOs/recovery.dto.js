class RecoveryDTO {
    constructor(hash, user) {
        this.hash = hash;
        // Crear una nueva fecha
        let fechaActual = new Date(Date.now());
        // Agregar una hora a la fecha actual
        fechaActual.setHours(fechaActual.getHours() + 1);
        this.fechaExpiracion = fechaActual;
        this.username = {
            _id: user._id,
            email: user.email
        };
    };

}

export default RecoveryDTO;