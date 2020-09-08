module.exports = Object.freeze({

  // Common
  OFFSET: 0,
  LIMIT: 10,
  SORT_TYPE: ['DESC', 'ASC'],
  SEARCH_TERM: '',

  // User
  USER_SORT_BY: ['createdAt', 'name', 'email'],
  USER_SEARCH_BY: ['name'],

  // Team
  TEAM_SORT_BY: ['createdAt', 'teamName'],
  TEAM_SEARCH_BY: ['teamName'],

  // Supervisor
  SUPERVISOR_SORT_BY: ['supervisorName']
});
