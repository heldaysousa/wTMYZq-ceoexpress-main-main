import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    pt: {
      translation: {
        // Dashboard Error Messages
        'dashboard.error.loading': 'Erro ao carregar o painel',
        'dashboard.error.revenue': 'Erro ao calcular receita',
        'dashboard.error.parse': 'Erro ao processar dados do painel',
        'dashboard.update.error': 'Erro ao atualizar painel',
        'dashboard.update.errorDescription':
          'Não foi possível salvar as alterações do painel',
        'dashboard.update.success': 'Painel atualizado com sucesso',
        'dashboard.update.successDescription':
          'As alterações foram salvas com sucesso',

        // Notification Messages
        'notifications.error': 'Erro ao carregar notificações',
        'notifications.new': 'Nova notificação',
        'notifications.reminderCreatedSuccess': 'Lembrete criado com sucesso',
        'notifications.reminderCreateError': 'Erro ao criar lembrete',
        'notifications.markReadError': 'Erro ao marcar como lida',
        'notifications.deleteError': 'Erro ao excluir notificação',

        // Revenue Calculation Messages
        'revenue.error.calculation': 'Erro ao calcular valores',
        'revenue.error.invalidAmount': 'Valor inválido detectado',
        'revenue.error.dataLoad': 'Erro ao carregar dados financeiros',
        // Auth translations
        'login.welcome': 'Bem-vindo ao CEO Express',
        'login.email': 'Email',
        'login.emailRequired': 'Por favor, insira seu email',
        'login.emailPlaceholder': 'Digite seu email',
        'login.password': 'Senha',
        'login.passwordRequired': 'Por favor, insira sua senha',
        'login.passwordPlaceholder': 'Digite sua senha',
        'login.forgotPassword': 'Esqueceu a senha?',
        'login.signIn': 'Entrar',
        'login.noAccount': 'Não tem uma conta?',
        'login.signUp': 'Cadastre-se',
        'login.errors.default': 'Ocorreu um erro ao fazer login',
        'login.errors.email': 'Email inválido',
        'login.errors.credentials': 'Email ou senha incorretos',

        // Dashboard translations
        Dashboard: 'Painel Inicial',
        'Total Revenue': 'Receita Total',
        'Active Clients': 'Clientes Ativos',
        Appointments: 'Agendamentos',
        'Popular Services': 'Serviços Populares',
        'Client Overview': 'Visão Geral de Clientes',
        'Service Overview': 'Visão Geral de Serviços',
        'Financial Summary': 'Resumo Financeiro',
        'Daily Revenue': 'Receita Diária',
        'Monthly Revenue': 'Receita Mensal',
        'Upcoming Appointments': 'Próximos Agendamentos',
        'dashboard.todayRevenue': 'Receita de Hoje',
        'dashboard.monthlyRevenue': 'Receita Mensal',
        'dashboard.todayAppointments': 'Agendamentos de Hoje',
        'dashboard.monthlyGoals': 'Metas Financeiras Mensais',

        // Menu translations
        Calendar: 'Calendário',
        Clients: 'Clientes',
        Services: 'Serviços',
        Finances: 'Finanças',
        Subscription: 'Assinatura',
        Help: 'Ajuda',
        Social: 'Redes Sociais',
        SocialMedia: 'Redes Sociais',
        'Products-Services': 'Produtos e Serviços',
        Profile: 'Perfil',
        Settings: 'Configurações',
        Logout: 'Sair',
        HelpCenter: 'Central de Ajuda',

        // Calendar translations
        'submenu.calendar.title': 'Calendário',
        'submenu.calendar.subtitle': 'Gerencie seus agendamentos',
        'submenu.calendar.create': 'Novo Agendamento',
        'submenu.calendar.view': 'Agendado',
        'submenu.calendar.edit': 'Confirmado',
        'submenu.calendar.cancel': 'Cancelado',
        'submenu.calendar.form.client': 'Cliente',
        'submenu.calendar.form.selectClient': 'Selecione um cliente',
        'submenu.calendar.form.service': 'Serviço',
        'submenu.calendar.form.selectService': 'Selecione um serviço',
        'submenu.calendar.form.startTime': 'Data e Hora',
        'submenu.calendar.success.create': 'Agendamento criado com sucesso',
        'submenu.calendar.error.create': 'Erro ao criar agendamento',
        'submenu.calendar.success.update': 'Agendamento atualizado com sucesso',
        'submenu.calendar.error.update': 'Erro ao atualizar agendamento',

        // Calendar weekdays translations
        'calendar.weekdays.short.sun': 'dom',
        'calendar.weekdays.short.mon': 'seg',
        'calendar.weekdays.short.tue': 'ter',
        'calendar.weekdays.short.wed': 'qua',
        'calendar.weekdays.short.thu': 'qui',
        'calendar.weekdays.short.fri': 'sex',
        'calendar.weekdays.short.sat': 'sáb',

        // Calendar months translations
        'calendar.months.january': 'Janeiro',
        'calendar.months.february': 'Fevereiro',
        'calendar.months.march': 'Março',
        'calendar.months.april': 'Abril',
        'calendar.months.may': 'Maio',
        'calendar.months.june': 'Junho',
        'calendar.months.july': 'Julho',
        'calendar.months.august': 'Agosto',
        'calendar.months.september': 'Setembro',
        'calendar.months.october': 'Outubro',
        'calendar.months.november': 'Novembro',
        'calendar.months.december': 'Dezembro',

        // Calendar format translations
        'calendar.format': {
          date: 'DD [de] MMMM [de] YYYY',
          monthYear: 'MMMM [de] YYYY',
        },

        // Clients page translations
        'clients.title': 'Clientes',
        'clients.columns.name': 'Nome',
        'clients.columns.email': 'Email',
        'clients.columns.phone': 'Telefone',
        'clients.columns.lastVisit': 'Última visita',
        'clients.columns.actions': 'Ações',
        'clients.modal.titleAdd': 'Adicionar novo cliente',
        'clients.form.name.label': 'Nome',
        'clients.form.email.label': 'Email',
        'clients.form.phone.label': 'Telefone',
        'clients.form.notes.label': 'Notas',
        'clients.form.lastVisit.label': 'Ultima visita',
        'clients.form.button.create': 'cadastrar cliente',
        'clients.form.button.cancel': 'cancelar',
        'submenu.clients.create': 'Novo Cliente',
        'submenu.clients.edit': 'Editar Cliente',
        'submenu.clients.delete': 'Excluir Cliente',
        'submenu.clients.search': 'Buscar clientes...',
        'submenu.clients.form.name': 'Nome',
        'submenu.clients.form.name.required':
          'Por favor, insira o nome do cliente!',
        'submenu.clients.form.email': 'Email',
        'submenu.clients.form.phone': 'Telefone',
        'submenu.clients.form.phone.required': 'Por favor, insira o telefone!',
        'submenu.clients.form.notes': 'Observações',
        'submenu.clients.form.lastVisit': 'Última Visita',
        'submenu.clients.table.name': 'Nome',
        'submenu.clients.table.email': 'Email',
        'submenu.clients.table.phone': 'Telefone',
        'submenu.clients.table.lastVisit': 'Última Visita',
        'submenu.clients.table.actions': 'Ações',
        'submenu.clients.modal.add': 'Adicionar Novo Cliente',
        'submenu.clients.modal.edit': 'Editar Cliente',
        'submenu.clients.button.update': 'Atualizar',
        'submenu.clients.button.create': 'Criar',
        'submenu.clients.button.cancel': 'Cancelar',

        // Reset Password translations
        'resetPassword.title': 'Redefinir senha',
        'resetPassword.description': 'Você receberá um link por email',
        'resetPassword.email': 'Email',
        'resetPassword.emailRequired': 'Por favor, insira seu email',
        'resetPassword.button': 'Redefinir senha',
        'resetPassword.success': 'Email enviado com sucesso',
        'resetPassword.error': 'Erro ao enviar email',

        // Auth translations
        'auth.signIn': 'Entrar',
        'auth.or': 'ou',
        'auth.signUp': 'Cadastre-se',

        // Form Labels & Fields
        'form.required': 'Campo obrigatório',
        'form.invalid': 'Campo inválido',
        'form.save': 'Salvar',
        'form.cancel': 'Cancelar',

        // Calendar Form Fields
        'calendar.form.title': 'Título',
        'calendar.form.date': 'Data',
        'calendar.form.time': 'Horário',
        'calendar.form.duration': 'Duração',
        'calendar.form.notes': 'Observações',
        'calendar.form.status': 'Status',
        'calendar.validation.required': 'Este campo é obrigatório',
        'calendar.validation.date': 'Data inválida',
        'calendar.validation.time': 'Horário inválido',
        'calendar.validation.overlap': 'Existe um conflito de horário',
        'calendar.validation.pastDate': 'Data não pode ser no passado',
        'calendar.validation.invalidTime': 'Horário inválido',
        'calendar.error.load': 'Erro ao carregar calendário',
        'calendar.error.invalidDate': 'Data inválida selecionada',
        'calendar.error.overlap': 'Horário conflita com outro agendamento',

        // Client Management Form Fields
        'client.form.address': 'Endereço',
        'client.form.city': 'Cidade',
        'client.form.state': 'Estado',
        'client.form.zipCode': 'CEP',
        'client.form.birthDate': 'Data de Nascimento',
        'client.form.gender': 'Gênero',
        'client.validation.email': 'Email inválido',
        'client.validation.phone': 'Telefone inválido',
        'client.validation.zipCode': 'CEP inválido',

        // Financial Management Form Fields
        'finance.form.amount': 'Valor',
        'finance.form.date': 'Data',
        'finance.form.category': 'Categoria',
        'finance.form.description': 'Descrição',
        'finance.form.type': 'Tipo',
        'finance.form.paymentMethod': 'Forma de Pagamento',
        'finance.validation.amount': 'Valor inválido',
        'finance.validation.required': 'Campo obrigatório',

        // Notification Form Fields
        'notification.form.title': 'Título',
        'notification.form.message': 'Mensagem',
        'notification.form.type': 'Tipo',
        'notification.form.recipients': 'Destinatários',
        'notification.form.schedule': 'Agendar',
        'notification.validation.required': 'Campo obrigatório',
        'notification.error.load': 'Erro ao carregar notificações',
        'notification.error.create': 'Erro ao criar notificação',
        'notification.error.update': 'Erro ao atualizar notificação',
        'notification.error.delete': 'Erro ao excluir notificação',
        'notification.error.markRead': 'Erro ao marcar como lida',
        'notification.error.invalidData': 'Dados da notificação inválidos',

        // Product/Service Management Form Fields
        'product.form.name': 'Nome',
        'product.form.price': 'Preço',
        'product.form.description': 'Descrição',
        'product.form.category': 'Categoria',
        'product.form.duration': 'Duração',
        'product.form.status': 'Status',
        'product.validation.required': 'Campo obrigatório',
        'product.validation.price': 'Preço inválido',

        // System Reload Messages
        'system.reload.success': 'Sistema recarregado com sucesso',
        'system.reload.error': 'Erro ao recarregar o sistema',
        'system.reload.retrying': 'Tentando recarregar novamente',
        'system.reload.failed': 'Falha ao recarregar o sistema',
        'system.reload.button': 'Recarregar Sistema'
      },
    },
  },
})

export default i18n
