(() => {
  const KEY = 'autoritm-v1';
  const $ = selector => document.querySelector(selector);
  const number = value => new Intl.NumberFormat('ru-RU').format(Number(value));
  const money = value => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 }).format(Number(value));
  const today = () => new Date().toLocaleDateString('sv-SE');
  const formatDate = value => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
  const id = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const isNonNegativeNumber = value => value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;

  let state = { car: null, tasks: [], expenses: [] };
  let storageReadFailed = false;
  let pendingDeletion = null;
  let deletionTrigger = null;

  function announce(message) {
    const status = $('#app-status');
    status.textContent = message;
    status.hidden = false;
  }

  function showAlert(message) {
    const alert = $('#app-alert');
    alert.textContent = message;
    alert.hidden = false;
  }

  function validStoredState(value) {
    return value && typeof value === 'object' && Array.isArray(value.tasks) && Array.isArray(value.expenses) && ('car' in value);
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === null) return;
      const parsed = JSON.parse(stored);
      if (!validStoredState(parsed)) throw new Error('Unexpected saved state');
      state = parsed;
    } catch (_) {
      storageReadFailed = true;
    }
  }

  function save(next) {
    if (storageReadFailed) {
      showAlert('Не удалось прочитать сохранённые данные. Новые записи не будут сохранены поверх старых, пока проблема не будет проверена.');
      return false;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      state = next;
      return true;
    } catch (_) {
      showAlert('Не удалось сохранить данные на этом устройстве. Проверьте, что в браузере разрешено локальное хранение и есть свободное место, затем повторите попытку.');
      return false;
    }
  }

  function text(tag, value, className) {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  }

  function clearErrors(form) {
    form.querySelectorAll('[aria-invalid="true"]').forEach(input => input.removeAttribute('aria-invalid'));
    form.querySelectorAll('[data-error-for]').forEach(error => { error.textContent = ''; });
  }

  function showFieldError(form, errorKey, fieldNames, message) {
    const target = form.querySelector(`[data-error-for="${errorKey}"]`);
    if (target) target.textContent = message;
    fieldNames.forEach(name => {
      const field = form.elements.namedItem(name);
      if (field) field.setAttribute('aria-invalid', 'true');
    });
  }

  function focusFirstInvalid(form, fields) {
    const first = fields.find(name => form.elements.namedItem(name));
    if (first) form.elements.namedItem(first).focus();
  }

  function taskStatus(task) {
    const carMileage = state.car && isNonNegativeNumber(state.car.mileage) ? Number(state.car.mileage) : null;
    const hasMileage = task.dueMileage !== '' && task.dueMileage !== undefined;
    const dueByMileage = hasMileage && carMileage !== null && Number(task.dueMileage) <= carMileage;
    const dueByDate = Boolean(task.dueDate) && task.dueDate <= today();
    const isDue = dueByMileage || dueByDate;
    const details = [];

    if (task.dueDate) details.push(dueByDate ? `Срок наступил по дате: ${formatDate(task.dueDate)}` : `До ${formatDate(task.dueDate)}`);
    if (hasMileage) {
      const remaining = carMileage === null ? null : Number(task.dueMileage) - carMileage;
      details.push(remaining === null ? `При ${number(task.dueMileage)} км` : remaining <= 0 ? `Срок наступил по пробегу: порог ${number(task.dueMileage)} км` : `Через ${number(remaining)} км`);
    }

    let dueTitle = '';
    if (dueByDate && dueByMileage) dueTitle = 'Срок наступил по дате и пробегу';
    else if (dueByDate) dueTitle = 'Срок наступил по дате';
    else if (dueByMileage) dueTitle = 'Срок наступил по пробегу';

    const dateDistance = task.dueDate ? Math.max(0, Math.ceil((new Date(`${task.dueDate}T00:00:00`) - new Date(`${today()}T00:00:00`)) / 86400000)) * 1000 : Infinity;
    const mileageDistance = hasMileage && carMileage !== null ? Math.max(0, Number(task.dueMileage) - carMileage) : Infinity;

    return { isDue, dueTitle, details: details.join(' · '), order: isDue ? -1 : Math.min(dateDistance, mileageDistance) };
  }

  function renderControl() {
    const card = $('#control');
    const icon = $('#control-icon');
    const kicker = $('#control-kicker');
    const title = $('#control-title');
    const message = $('#control-message');
    const action = $('#control-action');
    card.classList.remove('is-due');

    if (!state.car) {
      icon.textContent = '◷';
      kicker.textContent = 'КОНТРОЛЬ ОБСЛУЖИВАНИЯ';
      title.textContent = 'Добавьте автомобиль';
      message.textContent = 'Укажите марку, модель, год и текущий пробег, чтобы вести историю и планировать обслуживание.';
      action.textContent = 'Открыть паспорт автомобиля';
      action.href = '#vehicle';
      action.dataset.focusTarget = 'car-make';
      return;
    }

    if (!state.tasks.length) {
      icon.textContent = '◷';
      kicker.textContent = 'КОНТРОЛЬ ОБСЛУЖИВАНИЯ';
      title.textContent = 'Пока нет запланированных работ';
      message.textContent = 'Добавьте первую работу и срок по дате, пробегу или обоим критериям.';
      action.textContent = 'Добавить в план';
      action.href = '#maintenance';
      action.dataset.focusTarget = 'task-title';
      return;
    }

    const next = [...state.tasks].map(task => ({ task, status: taskStatus(task) })).sort((a, b) => a.status.order - b.status.order)[0];
    if (next.status.isDue) {
      card.classList.add('is-due');
      icon.textContent = '⚠';
      kicker.textContent = 'ТРЕБУЕТ ВНИМАНИЯ';
      title.textContent = next.status.dueTitle;
      message.textContent = `${next.task.title}. ${next.status.details}.`;
      action.textContent = 'Записать выполненную работу';
      action.href = '#history';
      action.dataset.focusTarget = 'expense-title';
      return;
    }

    icon.textContent = '◷';
    kicker.textContent = 'БЛИЖАЙШАЯ РАБОТА';
    title.textContent = next.task.title;
    message.textContent = `${next.status.details}. Срок задан вами — сверяйте интервалы с руководством автомобиля.`;
    action.textContent = 'Добавить в план';
    action.href = '#maintenance';
    action.dataset.focusTarget = 'task-title';
  }

  function openDelete(type, entry, trigger) {
    const buttons = [...trigger.closest('.items').querySelectorAll('.item-delete')];
    pendingDeletion = { type, entry, focusIndex: buttons.indexOf(trigger) };
    deletionTrigger = trigger;
    const dialog = $('#delete-dialog');
    $('#delete-title').textContent = type === 'tasks' ? 'Удалить работу из плана?' : 'Удалить запись?';
    $('#delete-message').textContent = `«${entry.title}» будет удалена без возможности восстановления.`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else if (window.confirm(`Удалить «${entry.title}»?`)) confirmDeletion();
  }

  function renderItem(container, entry, type, detail, isDue = false) {
    const row = document.createElement('div');
    row.className = `item${isDue ? ' is-due' : ''}`;
    const content = document.createElement('div');
    content.className = 'item-main';
    const title = document.createElement('div');
    title.className = 'item-title';
    if (isDue) title.append(text('span', '⚠', 'status-mark'));
    title.append(text('strong', entry.title));
    content.append(title, text('small', detail));

    const remove = text('button', 'Удалить', 'item-delete');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Удалить: ${entry.title}`);
    remove.addEventListener('click', () => openDelete(type, entry, remove));
    row.append(content, remove);
    container.append(row);
  }

  function renderTasks() {
    const tasks = $('#tasks');
    tasks.replaceChildren();
    if (!state.tasks.length) {
      tasks.append(text('p', 'Пока нет запланированных работ. Добавьте первую работу и срок.', 'empty-state'));
      return;
    }
    [...state.tasks]
      .map(task => ({ task, status: taskStatus(task) }))
      .sort((a, b) => a.status.order - b.status.order)
      .forEach(({ task, status }) => renderItem(tasks, task, 'tasks', status.details, status.isDue));
  }

  function renderExpenses() {
    const expenses = $('#expenses');
    expenses.replaceChildren();
    if (!state.expenses.length) expenses.append(text('p', 'История пока пуста. После выполненной работы добавьте запись — она появится здесь.', 'empty-state'));
    [...state.expenses].reverse().forEach(entry => {
      const detail = `${money(entry.amount)} · ${formatDate(entry.date)}${entry.mileage !== '' ? ` · ${number(entry.mileage)} км` : ''}`;
      renderItem(expenses, entry, 'expenses', detail);
    });
    $('#total').textContent = money(state.expenses.reduce((sum, entry) => sum + Number(entry.amount), 0));
  }

  function renderVehicle() {
    const summary = $('#vehicle-summary');
    if (!state.car) {
      summary.hidden = true;
      summary.textContent = '';
      return;
    }
    const { make, model, year, mileage, modification, region } = state.car;
    summary.textContent = `Сохранено: ${make} ${model}, ${year} · ${number(mileage)} км${modification ? ` · ${modification}` : ''}${region ? ` · ${region}` : ''}`;
    summary.hidden = false;
  }

  function render() {
    renderControl();
    renderVehicle();
    renderTasks();
    renderExpenses();
  }

  function validateCar(form, data) {
    clearErrors(form);
    const invalid = [];
    const currentYear = new Date().getFullYear() + 1;
    if (!data.make) { showFieldError(form, 'make', ['make'], 'Укажите марку автомобиля.'); invalid.push('make'); }
    if (!data.model) { showFieldError(form, 'model', ['model'], 'Укажите модель автомобиля.'); invalid.push('model'); }
    if (!Number.isInteger(Number(data.year)) || Number(data.year) < 1950 || Number(data.year) > currentYear) { showFieldError(form, 'year', ['year'], `Укажите год от 1950 до ${currentYear}.`); invalid.push('year'); }
    if (!isNonNegativeNumber(data.mileage)) { showFieldError(form, 'mileage', ['mileage'], 'Укажите текущий пробег без отрицательного значения.'); invalid.push('mileage'); }
    if (invalid.length) focusFirstInvalid(form, invalid);
    return !invalid.length;
  }

  function validateTask(form, data) {
    clearErrors(form);
    const invalid = [];
    if (!data.title) { showFieldError(form, 'title', ['title'], 'Укажите работу.'); invalid.push('title'); }
    const badMileage = data.dueMileage !== '' && !isNonNegativeNumber(data.dueMileage);
    if ((data.dueMileage === '' && !data.dueDate) || badMileage) {
      showFieldError(form, 'due', ['dueMileage', 'dueDate'], badMileage ? 'Укажите пробег без отрицательного значения.' : 'Укажите дату, пробег или оба срока.');
      invalid.push('dueMileage');
    }
    if (invalid.length) focusFirstInvalid(form, invalid);
    return !invalid.length;
  }

  function validateExpense(form, data) {
    clearErrors(form);
    const invalid = [];
    if (!data.title) { showFieldError(form, 'title', ['title'], 'Укажите название работы или расхода.'); invalid.push('title'); }
    if (!isNonNegativeNumber(data.amount) || Number(data.amount) === 0) { showFieldError(form, 'amount', ['amount'], 'Укажите сумму больше нуля.'); invalid.push('amount'); }
    if (!data.date) { showFieldError(form, 'date', ['date'], 'Укажите дату выполненной работы.'); invalid.push('date'); }
    if (data.mileage !== '' && !isNonNegativeNumber(data.mileage)) { showFieldError(form, 'mileage', ['mileage'], 'Укажите пробег без отрицательного значения.'); invalid.push('mileage'); }
    if (invalid.length) focusFirstInvalid(form, invalid);
    return !invalid.length;
  }

  function formData(form) {
    const data = Object.fromEntries(new FormData(form));
    Object.keys(data).forEach(key => { if (typeof data[key] === 'string') data[key] = data[key].trim(); });
    return data;
  }

  function confirmDeletion() {
    if (!pendingDeletion) return;
    const { type, entry, focusIndex } = pendingDeletion;
    if (!save({ ...state, [type]: state[type].filter(item => item.id !== entry.id) })) return;
    const dialog = $('#delete-dialog');
    if (dialog.open) dialog.close();
    render();
    announce(type === 'tasks' ? `Работа «${entry.title}» удалена из плана.` : `Запись «${entry.title}» удалена. Всего расходов: ${money(state.expenses.reduce((sum, item) => sum + Number(item.amount), 0))}.`);
    requestAnimationFrame(() => {
      const selector = type === 'tasks' ? '#tasks .item-delete' : '#expenses .item-delete';
      const buttons = [...document.querySelectorAll(selector)];
      const fallback = type === 'tasks' ? $('#task-title') : $('#expense-title');
      const target = buttons[Math.min(focusIndex, buttons.length - 1)] || fallback;
      target.focus();
    });
  }

  function restoreDeletionFocus() {
    if (deletionTrigger && deletionTrigger.isConnected) deletionTrigger.focus();
    pendingDeletion = null;
    deletionTrigger = null;
  }

  loadState();

  const carForm = $('#car-form');
  const taskForm = $('#task-form');
  const expenseForm = $('#expense-form');

  if (state.car) {
    Object.entries(state.car).forEach(([key, value]) => {
      const field = carForm.elements.namedItem(key);
      if (field) field.value = value;
    });
  }

  expenseForm.elements.date.value = today();

  carForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = formData(carForm);
    if (!validateCar(carForm, data)) return;
    if (save({ ...state, car: data })) {
      render();
      announce(`Автомобиль ${data.make} ${data.model} сохранён.`);
    }
  });

  taskForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = formData(taskForm);
    clearErrors(taskForm);
    if (!state.car) {
      showFieldError(taskForm, 'title', ['title'], 'Сначала сохраните автомобиль.');
      $('#car-make').focus();
      return;
    }
    if (!validateTask(taskForm, data)) return;
    if (save({ ...state, tasks: [...state.tasks, { ...data, id: id() }] })) {
      taskForm.reset();
      render();
      announce(`Работа «${data.title}» добавлена в план.`);
    }
  });

  expenseForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = formData(expenseForm);
    if (!validateExpense(expenseForm, data)) return;
    if (save({ ...state, expenses: [...state.expenses, { ...data, id: id() }] })) {
      expenseForm.reset();
      expenseForm.elements.date.value = today();
      render();
      announce(`Запись «${data.title}» сохранена. Всего расходов: ${money(state.expenses.reduce((sum, entry) => sum + Number(entry.amount), 0))}.`);
      $('#expense-title').focus();
    }
  });

  $('#control-action').addEventListener('click', () => {
    const target = document.getElementById($('#control-action').dataset.focusTarget);
    if (target) setTimeout(() => target.focus(), 0);
  });

  $('#confirm-delete').addEventListener('click', confirmDeletion);
  $('#cancel-delete').addEventListener('click', () => $('#delete-dialog').close());
  $('#delete-dialog').addEventListener('close', restoreDeletionFocus);

  if (storageReadFailed) showAlert('Не удалось прочитать сохранённые данные. Новые записи не будут сохранены поверх старых, пока проблема не будет проверена.');
  render();
})();
