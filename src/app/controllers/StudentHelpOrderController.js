import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrders';
import Student from '../models/Students';

class StudentHelpOrderController {
  async index(req, res) {
    const studentId = req.params.id;

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: studentId },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const studentId = req.params.id;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(400).json({
        error: 'O estudante não existe',
      });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      student_id: studentId,
      question,
    });

    return res.json(helpOrder);
  }
}

export default new StudentHelpOrderController();
