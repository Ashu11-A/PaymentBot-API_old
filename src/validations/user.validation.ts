import * as yup from 'yup'

export default new class userValidator {
  public register = yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6)
  })

  public login = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(6)
  })

  public update = yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    password: yup.string().required().min(6)
  })
}
