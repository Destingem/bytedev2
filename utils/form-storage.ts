const FORM_STORAGE_KEY = 'bytedev_contact_form'

export interface FormData {
  name: string
  company: string
  email: string
  phone: string
  website: string
  subject: string
  description: string
}

export function saveFormData(data: FormData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data))
}

export function loadFormData(): FormData {
  if (typeof window === 'undefined') {
    return {
      name: "", company: "", email: "", 
      phone: "", website: "", subject: "", 
      description: ""
    }
  }
  
  const stored = localStorage.getItem(FORM_STORAGE_KEY)
  return stored ? JSON.parse(stored) : {
    name: "", company: "", email: "", 
    phone: "", website: "", subject: "", 
    description: ""
  }
}

export function clearFormData() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(FORM_STORAGE_KEY)
}
