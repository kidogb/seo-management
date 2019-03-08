import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'form', ...(require('/Users/lucky/free/seo-qa/src/models/form.js').default) });
app.model({ namespace: 'global', ...(require('/Users/lucky/free/seo-qa/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/lucky/free/seo-qa/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/lucky/free/seo-qa/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/lucky/free/seo-qa/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('/Users/lucky/free/seo-qa/src/models/project.js').default) });
app.model({ namespace: 'rule', ...(require('/Users/lucky/free/seo-qa/src/models/rule.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/lucky/free/seo-qa/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/lucky/free/seo-qa/src/models/user.js').default) });
