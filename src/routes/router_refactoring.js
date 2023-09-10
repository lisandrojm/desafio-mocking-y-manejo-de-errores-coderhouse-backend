/* /src/routes/router.js */

/* Podrias reducir el anidamiento de los condicionales tanto en el handlePolicies como en el try-catch, que viene luego, para mayor legibilidad. Por ejemplo: */

handlePolicies = (policies) => async (req, res, next) => {
  if (policies[0] === 'PUBLIC') {
    console.log('~~~"handlePolicies" (public) access allowed.~~~');
    return next();
  }

  // Obtener el token desde la cookie "jwt"
  const token = req.cookies.jwt;

  if (!token) {
    console.log('No JWT token found.');

    // Si no hay token, intenta buscar el rol en req.user.role
    if (req.user && policies.includes(req.user.role.toUpperCase())) {
      console.log(`~~~"handlePolicies" Role (${req.user.role}) is allowed.~~~`);
      return next();
    }
    console.log('~~~"handlePolicies" Unauthorized: User role not allowed.~~~');

    //Redirecciones según el rol para sesiones
    if (!req.user) return res.redirect('/'); // Redirección genérica de que no existe el usuario

    const rolesUrls = {
      // objeto que guarda los roles existentes y sus distintas urls. Puede ir en otro archivo y luego importarse
      admin: '/admin',
      user: '/user',
    };

    const roleUrl = rolesUrls[req.user.role];

    if (roleUrl) {
      return res.redirect(roleUrl);
    }

    throw new Error(); // manejar el error de que no existe el usuario o no hay una urls para el usuario. Este seria un error de desarrollo ya que el sistema no deberia fallar. Tambien podrias hacer una redireccion especial
  }
  /* La idea es ingeniarselas para que sea mas simple la lectura y se pueda escalar de manera mas simple. Son solo detalles  */

  /* Los else no hacen falta cuando el codigo que viene despues se ejecuta si o si y no hay mas codigo extra */

  try {
    let user = jwt.verify(token, config.jwt_secret);

    if (policies.includes(user.role.toUpperCase())) {
      req.user = user;
      console.log(`~~~"handlePolicies" Role (${req.user.role}) is allowed.~~~`);
      next();
    }

    console.log('~~~"handlePolicies" Forbidden: User role not allowed.~~~');

    // En el siguiente codigo reutilizamos la logica del ejemplo anterior
    if (!req.user) return res.redirect('/'); // Redirección genérica de que no existe el usuario

    // Redirecciones según el rol para JWT
    if (roleUrl) {
      return res.redirect(roleUrl);
    }
  } catch (error) {
    console.log('~~~"handlePolicies" Unauthorized: JWT verification failed.~~~');

    if (error.name === 'JsonWebTokenError') {
      return res.redirect('/');
    }

    return res.redirect('/error'); // Otra redirección en caso de otros errores
  }
};

////////////////////////////////
handlePolicies = (policies) => async (req, res, next) => {
  if (policies[0] === 'PUBLIC') {
    console.log('~~~"handlePolicies" (public) access allowed.~~~');
    return next();
  }

  const token = req.cookies.jwt;

  if (!token) {
    console.log('No JWT token found.');

    if (req.user && policies.includes(req.user.role.toUpperCase())) {
      console.log(`~~~"handlePolicies" Role (${req.user.role}) is allowed.~~~`);
      return next();
    }

    console.log('~~~"handlePolicies" Unauthorized: User role not allowed.~~~');

    // Redirecciones según el rol para sesiones
    if (req.user && req.user.role === 'admin') {
      return res.redirect('/admin');
    } else if (req.user && req.user.role === 'user') {
      return res.redirect('/user');
    }

    return res.redirect('/'); // Redirección genérica
  }

  try {
    let user = jwt.verify(token, config.jwt_secret);

    if (!policies.includes(user.role.toUpperCase())) {
      console.log('~~~"handlePolicies" Forbidden: User role not allowed.~~~');

      // Redirecciones según el rol para JWT
      if (user.role === 'admin') {
        return res.redirect('/admin');
      } else if (user.role === 'user') {
        return res.redirect('/user');
      }

      return res.redirect('/'); // Redirección genérica
    }

    req.user = user;
    console.log(`~~~"handlePolicies" Role (${req.user.role}) is allowed.~~~`);
    next();
  } catch (error) {
    console.log('~~~"handlePolicies" Unauthorized: JWT verification failed.~~~');

    if (error.name === 'JsonWebTokenError') {
      return res.redirect('/');
    }

    return res.redirect('/error'); // Otra redirección en caso de otros errores
  }
};
