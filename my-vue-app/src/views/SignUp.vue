<template>
  <div class="signup-container">
    <div class="signup-card">
      <h2>Create Account</h2>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <input type="text" placeholder="Name" v-model="name" />
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />

      <button @click="signUp">Sign Up</button>
      <router-link to="/login" class="login-link">Already have an account? Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const signUp = async () => {
  error.value = ''
  if (!name.value || !email.value || !password.value) {
    error.value = 'All fields are required.'
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const uid = userCredential.user.uid

    await setDoc(doc(db, 'users', uid), {
      uid,
      name: name.value,
      email: email.value,
      role: 'user', // ✅ Always set role to 'user'
      createdAt: serverTimestamp()
    })

    router.push('/login')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.signup-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #b993d6, #8ca6db);
}

.signup-card {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 40px 30px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: none;
  outline: none;
}

button {
  width: 100%;
  background-color: #133a6f;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #0b2652;
}

.error-msg {
  color: crimson;
  background-color: #ffe5e5;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.login-link {
  display: block;
  margin-top: 15px;
  color: white;
  text-decoration: underline;
}
</style>
