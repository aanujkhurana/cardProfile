<template>
  <header>
    <h2 class="h2 article-title">Contact</h2>
  </header>
  <section class="contact-form">
    <form @submit.prevent="handleSubmit" class="form" data-form>
      <div class="input-wrapper">
        <input
          type="text"
          name="name"
          v-model="formData.name"
          class="form-input"
          placeholder="Full name"
          required
          data-form-input
        />
        <span v-if="errors.name" class="form-error">{{ errors.name }}</span>

        <input
          type="email"
          name="email"
          v-model="formData.email"
          class="form-input"
          placeholder="Email address"
          required
          data-form-input
        />
        <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
      </div>

      <textarea
        name="message"
        v-model="formData.message"
        class="form-input"
        placeholder="Your Message"
        required
        data-form-input
      ></textarea>
      <span v-if="errors.message" class="form-error">{{ errors.message }}</span>

      <button class="form-btn" type="submit" :disabled="loading" data-form-btn>
        <ion-icon name="paper-plane"></ion-icon>
        <span>{{ loading ? "Sending..." : "Send Message" }}</span>
      </button>

      <p v-if="isFormSubmitted" class="form-success">Thank you for your message!</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { client } from "../lib/client";

const formData = ref({ name: "", email: "", message: "" });
const isFormSubmitted = ref(false);
const loading = ref(false);
const errors = ref({});

const handleSubmit = () => {
  errors.value = {};
  const { name, email, message } = formData.value;
  const validationErrors = {};

  if (!name.trim()) validationErrors.name = "Name is required";
  if (!email.trim()) {
    validationErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    validationErrors.email = "Invalid email format";
  }
  if (!message.trim()) validationErrors.message = "Message is required";

  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  loading.value = true;

  const contact = {
    _type: "contact",
    name: formData.value.name,
    email: formData.value.email,
    message: formData.value.message,
  };

  client
    .create(contact)
    .then(() => {
      loading.value = false;
      isFormSubmitted.value = true;
      formData.value = { name: "", email: "", message: "" };
    })
    .catch((err) => {
      console.error(err);
      loading.value = false;
      formData.value = { name: "", email: "", message: "" };
    });
};
</script>

<style scoped>
.form-error {
  color: red;
  font-size: 0.875rem;
  margin-top: -10px;
  margin-bottom: 10px;
}

.form-success {
  color: green;
  font-size: 1rem;
  margin-top: 10px;
}
</style>
