import * as Yup from 'yup';
import Student from '../models/Students';
import User from '../models/Users';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      year: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
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

    const { id, name, email, year, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      year,
      weight,
      height,
    });
  }

  async update(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      year: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { id } = req.params;

    const student = await Student.findOne({ where: { id } });

    if (!student) {
      return res.status(404).json({ error: 'Estudante não existe' });
    }

    const { name, email, year, weight, height } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      year,
      weight,
      height,
    });
  }
}

export default new StudentController();
