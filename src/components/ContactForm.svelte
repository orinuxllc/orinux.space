<script lang="ts">
  let name = $state("");
  let email = $state("");
  let company = $state("");
  let message = $state("");
  let submitted = $state(false);
  let submitting = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;

    // TODO: Replace with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    submitted = true;
    submitting = false;
  }
</script>

{#if submitted}
  <div class="rounded-2xl border border-primary-500/30 bg-primary-500/10 p-8 text-center">
    <div
      class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/20"
    >
      <svg
        class="h-8 w-8 text-primary-400"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h3 class="mt-4 text-xl font-semibold">Баярлалаа!</h3>
    <p class="mt-2 text-surface-200">
      Таны хүсэлтийг хүлээн авлаа. Бид тантай удахгүй холбогдоно.
    </p>
  </div>
{:else}
  <form onsubmit={handleSubmit} class="space-y-6">
    <div class="grid gap-6 sm:grid-cols-2">
      <div>
        <label for="name" class="mb-2 block text-sm font-medium">Нэр *</label>
        <input
          type="text"
          id="name"
          bind:value={name}
          required
          class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50"
          placeholder="Таны нэр"
        />
      </div>
      <div>
        <label for="email" class="mb-2 block text-sm font-medium">И-мэйл *</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50"
          placeholder="email@company.mn"
        />
      </div>
    </div>

    <div>
      <label for="company" class="mb-2 block text-sm font-medium">Байгууллага</label>
      <input
        type="text"
        id="company"
        bind:value={company}
        class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50"
        placeholder="Байгууллагын нэр"
      />
    </div>

    <div>
      <label for="message" class="mb-2 block text-sm font-medium">Мессеж *</label>
      <textarea
        id="message"
        bind:value={message}
        required
        rows="4"
        class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50"
        placeholder="Юу хэлэхийг хүсэж байна вэ?"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={submitting}
      class="w-full rounded-xl bg-primary-600 py-3 font-medium transition-colors hover:bg-primary-500 disabled:opacity-50"
    >
      {submitting ? "Илгээж байна..." : "Илгээх"}
    </button>
  </form>
{/if}
