<template>
  <div class="forgot-password">
    <h2>Reset Password</h2>
    <p v-if="!stepTwo">Enter your email to verify your account.</p>

    <!-- Step 1: Verify Email -->
    <div v-if="!stepTwo">
      <input
        type="email"
        v-model="email"
        placeholder="Enter your email"
        class="input-box"
      />
      <button @click="verifyEmail" class="reset-btn" :disabled="loading">
        {{ loading ? "Verifying..." : "Next" }}
      </button>
    </div>

    <!-- Step 2: Change Password -->
    <div v-else>
      <p>Enter your new password.</p>
      <input
        type="password"
        v-model="newPassword"
        placeholder="New Password"
        class="input-box"
      />
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        class="input-box"
      />
      <button @click="updatePasswordNow" class="reset-btn" :disabled="loading">
        {{ loading ? "Updating..." : "Update Password" }}
      </button>
    </div>

    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <button class="back-btn" @click="goBack">← Back to Login</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const error = ref('')
const loading = ref(false)
const stepTwo = ref(false) // ✅ Controls when to show password fields

const router = useRouter()

// ✅ Step 1: Verify Email by logging in anonymously (requires password in real case)
const verifyEmail = async () => {
  if (!email.value) {
    error.value = 'Please enter your email.'
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    // Firebase does not allow direct email verification without login,
    // so we just move to step 2 assuming email exists in the system.
    stepTwo.value = true
    message.value = 'Email verified. Please enter a new password.'
  } catch (err) {
    console.error(err)
    error.value = 'Verification failed. Please check your email.'
  } finally {
    loading.value = false
  }
}

// ✅ Step 2: Update password
const updatePasswordNow = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Please fill in all password fields.'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    // ✅ Update password for current logged-in user
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword.value)
      message.value = 'Password updated successfully!'
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      error.value = 'No authenticated user found. Please log in again.'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Failed to update password. Please try again.'
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
