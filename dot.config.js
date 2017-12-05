var engine = require('express-dot-engine');
// doT settings 
engine.settings.dot = {
    evaluate:    /\[\[([\s\S]+?)\]\]/g,
    interpolate: /\[\[=([\s\S]+?)\]\]/g,
    encode:      /\[\[!([\s\S]+?)\]\]/g,
    use:         /\[\[#([\s\S]+?)\]\]/g,
    define:      /\[\[##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\]\]/g,
    conditional: /\[\[\?(\?)?\s*([\s\S]*?)\s*\]\]/g,
    iterate:     /\[\[~\s*(?:\]\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\]\])/g,
    varname: 'layout, partial, locals, model',
    strip: false,
    append: true,
    selfcontained: false,
  };

  
  module.exports=engine.settings.dot;