import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CreateEnrollmentMail {
  get key() {
    return 'CreateEnrollmentMail';
  }

  async handle({ data }) {
    const {
      studentExists,
      start_date,
      title,
      durationPlan,
      end_date,
      price,
    } = data;

    await Mail.sendMail({
      to: `${studentExists.nome} <${studentExists.email}>`,
      subject: 'Matrícula feita com sucesso',
      template: 'createEnrollment',
      context: {
        student: studentExists.nome,
        dateStart: format(parseISO(start_date), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        plan: title,
        duration:
          durationPlan === 1 ? `${durationPlan} mês` : `${durationPlan} meses`,
        dateEnd: format(parseISO(end_date), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        price: price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          currencyDisplay: 'symbol',
        }),
      },
    });
  }
}

export default new CreateEnrollmentMail();
