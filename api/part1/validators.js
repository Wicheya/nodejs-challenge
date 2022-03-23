import Joi from "joi"

function postPayloadValidator(){
  const children = Joi.object({
    id : Joi.number().required(),
    title: Joi.string().required(),
    level: Joi.number().required(),
    children: Joi.array().items(Joi.link("#children")),
    parent_id: Joi.number().allow(null),
  })
  return Joi.object().pattern(Joi.string(), Joi.array().items(children))
}

export default {
  post: { 
    payload : postPayloadValidator()
  }
}
