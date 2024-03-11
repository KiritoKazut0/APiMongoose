import rateLimit from "express-rate-limit";

export const Login = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Demasiados intentos, inténtalo de nuevo después de 15 minutos",
});



export const changePassword = rateLimit({
windowMs: 24 * 60 * 60 * 1000, 
  max: 3, 
  message: "Demasiadas actualizaciones, inténtalo de nuevo después de 24 horas",
})

