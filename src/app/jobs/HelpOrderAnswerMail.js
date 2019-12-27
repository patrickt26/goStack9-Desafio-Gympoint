import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { helpOrder, question, answer } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Pedido de auxílio respondido',
      template: 'helpOrderAnswer',
      context: {
        student: helpOrder.student.name,
        question,
        answer,
      },
    });
  }
}

export default new HelpOrderAnswerMail();
