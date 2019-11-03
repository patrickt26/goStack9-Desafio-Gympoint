import * as Yup from 'yup';
import Plan from '../models/Plans';
import User from '../models/Users';

class PlanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      order: ['duration'],
      attributes: ['id', 'title', 'duration', 'price'],
      limit: 5,
      offset: (page - 1) * 5,
    });

    return res.json(plans);
  }

  async store(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res
        .status(400)
        .json({ error: 'Plano com mesmo nome já cadastrado' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plano não existe' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const user = await User.findOne({ where: { id: req.userId, admin: true } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário sem privilégio' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plano não existe' });
    }

    await plan.destroy({
      where: { id: plan.id },
    });

    return res.json({
      message: `O plano ${plan.title}, com duração de ${plan.duration} meses, foi deletado`,
    });
  }
}

export default new PlanController();
