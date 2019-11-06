import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrders';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const helpOrder = await HelpOrder.findByPk(req.params.id);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Pedido de auxílio não existe' });
    }

    if (helpOrder.answer != null) {
      return res.status(400).json({ error: 'Pedido de auxílio já respondido' });
    }

    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Uma resposta é necessária' });
    }

    const {
      id,
      student_id,
      question,
      answer,
      answer_at,
    } = await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    return res.json({
      id,
      student_id,
      question,
      answer,
      answer_at,
    });
  }
}

export default new HelpOrderController();
