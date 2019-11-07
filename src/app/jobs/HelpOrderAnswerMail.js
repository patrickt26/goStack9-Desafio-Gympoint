import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { helpOrder, question, answer } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.nome} <${helpOrder.student.email}>`,
      subject: 'Pedido de auxílio respondido',
      template: 'helpOrderAnswer',
      context: {
        student: helpOrder.student.nome,
        question,
        answer,
      },
    });
  }
}

export default new HelpOrderAnswerMail();
