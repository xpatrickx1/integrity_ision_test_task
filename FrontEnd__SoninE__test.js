
const generateKeyNameObject = ( routes, localesObj ) => {
  let nameObj = {};
  for ( let [ key, value ] of Object.entries( localesObj ) ) {
    const pathLocales = key.split( "." );
    let isEqualPath = compareArrays(routes, pathLocales)
    if ( isEqualPath ) {
      nameObj = Object.assign( {}, { "name": value } );
      return nameObj
    } else {
      value = routes[routes.length - 1]
      nameObj = Object.assign( {}, { "name": value } );
    }
  }
  return nameObj
}

const compareArrays = (a1, a2) => {
  return a1.length == a2.length && a1.every((v,i)=>v === a2[i])
};

const formatDate = ( date ) => {
  const dateRegExYearLast = /\d{2}([\/-])\d{2}\1\d{4}/;
  const dateRegExYearFirst = /\d{4}([\/.-])\d{2}\1\d{2}/;
  const  formatRule = (arg) => {
    let day = arg.getDate();
    let month = arg.getMonth() + 1;
    let year = arg.getFullYear();

    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return `${day}.${month}.${year}`;
  };

  if ( Object.prototype.toString.call( date ) === "[object Date]" && !isNaN( date ) ) {
    const formatedDate = formatRule(date);
    return formatedDate
  }

  if ( date.toString().match(dateRegExYearFirst) ) {
    let wrongDate = date.match(dateRegExYearFirst)[0];
    let newDate = new Date(wrongDate);
    let formatedDate = formatRule(newDate);
    return formatedDate
  }

  if ( date.toString().match(dateRegExYearLast) ) {
    const reg = /[\/-]/g
    const wrongDate = date.match(dateRegExYearLast)[0];
    const formatedDate = wrongDate.replace(reg, '.');
    return formatedDate
  }
  return date
};

const collectObjects = ( objArr, rules, localization ) => {
  let newArr = [],
      path = [],
      object = objArr[ 0 ],
      isNeed = rules;

  path.forEach( pathName => {
    isNeed = isNeed[ pathName ];
  } );

  if ( Object.prototype.toString.call( objArr ) !== "[object Array]" || objArr === null ) {
    return objArr;
  }

  function deepDrillObject( obj ) {
    let value = obj;
    let keyCounter = 1;

    for ( let key in obj ) {
      path.push( key );
      value = obj[ key ];

      if ( typeof value !== "object" ) {
        let newObject = {};
        let isNeed = rules;
        path.forEach( pathName => {
          isNeed = isNeed[ pathName ];
        } );

        if ( isNeed ) {
          let result = objArr.map( obj => {
            let newKey = `value${keyCounter}`,
              newObj = {},
              item = obj;

            path.forEach( pathName => {
              item = item[ pathName ];
            } );
            if ( typeof( item ) === "boolean" ) {
              item ? item = "Так" : item = "Ні";
            }

            item = formatDate(item);

            newObj[ newKey ] = item;
            keyCounter++;
            return newObj
          } );

          let nameOb = generateKeyNameObject( path, localization )
          result.forEach( obj => Object.assign( newObject, nameOb, obj ) );
          newArr.push( newObject );
        }

          path.pop();
          keyCounter = 1;

      } else {
        deepDrillObject( value );
      }
    }
    path = []
  }
  deepDrillObject( object );
    
  return newArr
};

collectObjects( objArr, rulesObj, localizationsObj );
