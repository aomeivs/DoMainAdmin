module.exports = {

    checkLogin(req, res, next) {
      // 
      if (!req.session.user) {
        return res.redirect('/domain/signin');
      }
      next();
    },
  
    checkNotLogin(req, res, next) {
      if (req.session.user) {
        return res.redirect('back');//返回之前的页面
      }
      next();
    }
  };