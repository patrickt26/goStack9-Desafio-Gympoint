import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkins';
import Student from '../models/Students';

class CheckinController {
  async index(req, res) {
    const studentId = req.params.id;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(401).json({ error: 'Estudante não existe!' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: studentId },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const studentId = req.params.id;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(401).json({ error: 'Estudante não existe!' });
    }

    const searchWeek = new Date();

    const checkins = await Checkin.findAll({
      where: {
        student_id: studentId,
        created_at: {
          [Op.between]: [startOfWeek(searchWeek), endOfWeek(searchWeek)],
        },
      },
    });

    if (checkins.length >= 5) {
      return res.status(400).json({
        error: 'Estudante já realizou mais de 5 check-in essa semana',
      });
    }

    const { name } = student;

    const { id, student_id } = await Checkin.create({
      student_id: studentId,
    });

    return res.json({
      id,
      student_id,
      name,
    });
  }
}

export default new CheckinController();
