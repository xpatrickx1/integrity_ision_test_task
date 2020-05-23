const objArr = [
  {
    fullName: {
      surname: "xxx",
      firstName: "yyy",
      middleName: "zzz"
    }
  },
  {
    fullName: {
      surname: "XXX",
      firstName: "YYY",
      middleName: "ZZZ"
    }
  },
  {
    fullName: {
      surname: "lsjnvlsds",
      firstName: "sdvsdvs",
      middleName: "zsdvsdvzz"
    }
  },
];
const rulesArr = {
    fullName: {
      surname: true,
      firstName: true,
      middleName: false
    }
  };
const localizationsObj = {
    "fullName.surname": "Прiзвище",
    "fullName.firstName": "Im`я",
    "fullName.middleName": "По-батьковi"
  };
const result = [
  {
    name: "Прiзвище",
    value1: "xxx",
    value2: "XXX"
  },
  {
    name: "firstName",
    value1: "yyy",
    value2: "YYY"
  }
];


function objectCombiner( objArr, rules, localization ) {

  const resultArr = [];

  for ( let [ key, value ] of Object.entries( localization ) ) {
    const path = key.split( "." );
    let keyCounter = 1;
    const newObj = Object.assign({}, {"name": value});
    let access = rules;

    path.forEach( pathName => {
      access = access[pathName]
    });

    if ( access ) {
      objArr.forEach( item => {
        let currentValue = item;
        let newKey = `value${keyCounter}`;

        path.forEach( pathName => {
          currentValue = currentValue[ pathName ];
        } );
        newObj[ newKey ] = currentValue;
        keyCounter++;
      } );
      resultArr.push( newObj );
    }
  }
  return resultArr
}

objectCombiner( objArr, rulesArr, localizationsObj );