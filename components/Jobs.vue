<template>
  <section>
    <div class="row mt-5">
      <div class="card-group">
        <div class="row">
          <div class="col-md-8">
            <Job v-for="(job, i) in jobs" :key="i" :job="job" />
          </div>

          <div class="col-md-4 mt-3">
            <!-- <Newsletter /> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      jobs: (state) => {
        return [...state.job.jobs].slice(0, 10)
      },
    }),
  },
}
</script>
<style></style>