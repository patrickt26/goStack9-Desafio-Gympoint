import User from '../models/Users';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const { id, nome, email } = await User.create(req.body);

    return res.json({
      id,
      nome,
      email,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário não existe' });
      }
    }

    if (!(await user.checkPasssword(oldPassword))) {
      return res.status(401).json({ error: 'Não há ningue no escritorio' });
    }

    return res.json({ ok: true });
  }
}

export default new UserController();
