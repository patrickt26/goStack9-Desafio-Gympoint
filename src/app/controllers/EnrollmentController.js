import * as Yup from 'yup';
import { isBefore, parseISO, addMonths, startOfDay } from 'date-fns';

import User from '../models/Users';
import Student from '../models/Students';
import Enrollment from '../models/Enrollments';
import Plan from '../models/Plans';

class EnrollmentController {
  async index(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      order: ['start_date', 'id'],
      attributes: ['id', 'price', 'start_date', 'end_date'],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'nome'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async store(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Valida estudante
     */
    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({
        error: 'O estudante informado não existe',
      });
    }

    /**
     * Valida estudante tem matrícula
     */
    const studantHasEnrollment = await Enrollment.findOne({
      where: { student_id },
    });

    if (studantHasEnrollment) {
      return res.status(400).json({ error: 'Estudante já possui matrícula' });
    }

    /**
     * Valida plano
     */
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'Plano não existe' });
    }

    /**
     * Valida data
     */
    const startDate = startOfDay(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'Datas antigas não são permitidas' });
    }

    const { duration, price: pricePlan } = plan;

    const endDate = addMonths(startDate, duration);

    const { price, end_date } = await Enrollment.create({
      student_id,
      plan_id,
      price: pricePlan * duration,
      start_date: startDate,
      end_date: endDate,
    });

    return res.json({
      student_id,
      plan_id,
      price,
      start_date,
      end_date,
    });
  }

  async update(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Matrícula não existe' });
    }

    const {
      plan_id = enrollment.plan_id,
      start_date = enrollment.start_date,
    } = req.body;

    /**
     * Valida plano
     */
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'Plano não existe' });
    }

    /**
     * Valida data
     */
    const startDate = startOfDay(parseISO(start_date))
      ? start_date
      : parseISO(enrollment.start_date);

    if (isBefore(startDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'Datas antigas não são permitidas' });
    }

    const { duration, price: pricePlan } = plan;

    const endDate = addMonths(startDate, duration);

    const { student_id, price, end_date } = await enrollment.update({
      plan_id,
      price: pricePlan * duration,
      start_date: startDate,
      end_date: endDate,
    });

    return res.json({
      student_id,
      plan_id,
      price,
      start_date,
      end_date,
    });
  }
}

export default new EnrollmentController();
