export const actions = {
  async nuxtServerInit({ dispatch }) {
    try {
      await dispatch('job/getJobs')
    } catch (error) {}
  },
}
