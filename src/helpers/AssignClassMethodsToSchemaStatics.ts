import { Schema } from "mongoose";

interface IClass{
  new():  any
  prototype: any
}

export function AssignClassMethodsToSchemaStatics(c: IClass, schema: Schema){
  let obj = new c()
  let methods = Object.getOwnPropertyNames(c.prototype) as string[];
  for(let k in methods){
    let name = methods[k]
    if(name !== 'constructor'){
      schema.statics[name] = obj[name]
    }
  }
}