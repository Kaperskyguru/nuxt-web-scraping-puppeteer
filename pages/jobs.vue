<template>
  <div class="row mt-5">
    <div class="card-group">
      <div class="row">
        <div class="col-md-8">
          <Job v-for="(job, i) in jobs" :key="i" :job="job" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    const getJobs = store.getters['job/getJobs']
    let jobs = getJobs()
    if (!jobs.length) {
      jobs = await store.dispatch('job/getJobs')
    }
    return { jobs }
  },
}
</script>