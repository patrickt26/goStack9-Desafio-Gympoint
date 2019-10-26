import * as Yup from 'yup';
import Student from '../models/Students';
import User from '../models/Users';

class StudentController {
  async store(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Estudante já cadastrado' });
    }

    const { id, nome, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      nome,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.number(),
      peso: Yup.number(),
      altura: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { id } = req.params;

    const student = await Student.findOne({ where: { id } });

    if (!student) {
      return res.status(404).json({ error: 'Estudante não existe' });
    }

    const { nome, email, idade, peso, altura } = await student.update(req.body);

    return res.json({
      id,
      nome,
      email,
      idade,
      peso,
      altura,
    });
  }
}

export default new StudentController();
