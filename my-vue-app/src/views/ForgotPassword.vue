<template>
  <div class="forgot-password">
    <h2>Reset Password</h2>
    <p>Enter your email, and we'll send you a password reset link.</p>

    <input
      type="email"
      v-model="email"
      placeholder="Enter your email"
      class="input-box"
    />
    <button @click="resetPassword" class="reset-btn" :disabled="loading">
      {{ loading ? "Sending..." : "Send Reset Link" }}
    </button>

    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <button class="back-btn" @click="goBack">← Back to Login</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const email = ref('')
const message = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

// ✅ Send Firebase Reset Password Email
const resetPassword = async () => {
  if (!email.value) {
    error.value = 'Please enter your email.'
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    await sendPasswordResetEmail(auth, email.value)
    message.value =
      'A password reset email has been sent. Please check your inbox.'
    email.value = ''
  } catch (err) {
    console.error(err)
    if (err.code === 'auth/user-not-found') {
      error.value = 'No account found with this email.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else {
      error.value = 'Failed to send reset email. Try again later.'
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/login')
}
</script>

<style scoped>
.forgot-password {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}
h2 {
  color: #133a6f;
  margin-bottom: 10px;
}
p {
  margin-bottom: 15px;
}
.input-box {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.reset-btn {
  background: #133a6f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}
.reset-btn[disabled] {
  background: #aaa;
  cursor: not-allowed;
}
.message {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
.back-btn {
  margin-top: 15px;
  background: transparent;
  border: none;
  color: #133a6f;
  cursor: pointer;
  font-weight: bold;
}
.back-btn:hover {
  text-decoration: underline;
}
</style>
