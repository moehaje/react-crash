import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"
import HomePage from "./pages/HomePage"
import JobsPage from "./pages/JobsPage"
import NotFoundPage from "./pages/NotFoundPage"
import JobPage, { jobLoader } from "./pages/JobPage"
import AddJobPage from "./pages/AddJobPage"
import { stringify } from "postcss"
import EditJobPage from "./pages/EditJobPage"

const App = () => {
  // Add new Job
  const addJob = async (newJob) => {

    // Fetch the existing jobs to determine the highest ID
    const res = await fetch('/api/jobs')
    const jobs = await res.json()

    // Determine the new ID
    const highestId = jobs.length ? Math.max(...jobs.map(job => job.id)) : 0
    const newId = (highestId + 1).toString()

    // Add the new ID to the job data
    const jobWithId = { ...newJob, id: newId }

    const postRes = await fetch ('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobWithId)
    })

    if (!postRes.ok) {
      // Handle error if the post request fails
      console.error('Failed to add job')
    }
  }

  // Delete Job
  const deleteJob = async (id) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE'
    })
    return
  }

  // Update Job
  const updateJob = async (job) => {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(job)
    })
    return
  }
  
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/add-job" element={<AddJobPage addJobSubmit={addJob} />} />
      <Route path="/edit-job/:id" element={<EditJobPage updateJobSubmit={updateJob} />} loader={jobLoader} />
      <Route path="/jobs/:id" element={<JobPage deleteJob={deleteJob} />} loader={jobLoader} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>)
  )

  return <RouterProvider router={router} />
}

export default App