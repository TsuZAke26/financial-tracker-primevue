import { createRouter, createWebHistory } from 'vue-router';
import { anonClient } from '@/supabase/clients/anon-client';
import HomeView from '../views/HomeView.vue';
import AuthView from '@/views/AuthView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: {
        auth: false
      }
    },
    {
      path: '/',
      component: () => import('@/layouts/SignedInLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue')
        },
        {
          path: '/accounts/:accountId',
          name: 'account',
          component: () => import('@/views/accounts/AccountView.vue'),
          props: true
        }
      ],
      meta: {
        auth: true
      }
    }
  ]
});

router.beforeEach(async (to) => {
  const isSignedIn = (await anonClient.auth.getSession()).data.session;

  if (to.meta?.auth && !isSignedIn) {
    return { name: 'auth' };
  } else if (!to.meta?.auth && isSignedIn) {
    return { name: 'home' };
  }
  return true;
});

export default router;
