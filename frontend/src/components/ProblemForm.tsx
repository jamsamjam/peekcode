import CreatableSelect from "react-select/creatable";
import type { ProblemType } from "@backend/models/problem.model";
import type { FormEvent } from 'react'

interface ProblemFormProps {
  initialData?: ProblemType | null;
  selectedTags: Array<{ value: string; label: string }>;
  setSelectedTags: (tags: Array<{ value: string; label: string }>) => void;
  tags: Array<{ value: string; label: string }>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const ProblemForm = ({ initialData, selectedTags, setSelectedTags, tags, onSubmit, onClose}: ProblemFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event);
    onClose();
  };

  return (<form onSubmit={handleSubmit}>
    <label className="form-label" htmlFor="title">Title</label>
    <input type="text" className="form-control" id="title" name="title" defaultValue={initialData?.title ?? ''} />
    <label className="form-label" htmlFor="url">URL</label>
    <input type="text" className="form-control" id="url" name="url" defaultValue={initialData?.url ?? ''} />
    <label className="form-label" htmlFor="difficulty">Difficulty</label>
    <select className="form-select" aria-label="difficulty" id="difficulty" name="difficulty" defaultValue={initialData?.difficulty}>
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </select>
    <label className="form-label" htmlFor="status">Status</label>
    <select className="form-select" aria-label="status" id="status" name="status" defaultValue={initialData?.status}>
      <option value="Solved">Solved</option>
      <option value="Attempted">Attempted</option>
      <option value="ReviewNeeded">Review Needed</option>
      <option value="Skipped">Skipped</option>
    </select>
    <label className="form-label" htmlFor="date">Date</label>
    <input type="date" className="form-control" id="date" name="date" defaultValue={initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : ""}></input>
    <label className="form-label" htmlFor="timeSpent">Time Spent</label>
    <input type="number" className="form-control" id="timeSpent" name="timeSpent" min="0" defaultValue={initialData?.timeSpent ?? 0} />
    <label className="form-label" htmlFor="tags">Tags</label>
    <div className="App" id="tags">
      <CreatableSelect
        isMulti
        value={selectedTags}
        onChange={(newValue) => setSelectedTags(newValue as Array<{ value: string, label: string }>)}
        placeholder=''
        noOptionsMessage={() => 'Type to Create'}
        options={tags}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'var(--bs-body-bg)',
            color: 'var(--bs-body-color)',
            border: 'var(--bs-border-width) solid var(--bs-border-color)',
            borderRadius: 'var(--bs-border-radius)',
          }),
          input: (base) => ({
            ...base,
            color: "var(--bs-body-color)"
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "var(--bs-body-bg)",
            border: `var(--bs-border-width) solid var(--bs-border-color)`
          }),
          menuList: (base) => ({
            ...base,
            backgroundColor: "var(--bs-body-bg)"
          }),
        }}
      />
    </div>
    <label className="form-label" htmlFor="notes">Notes</label>
    <input type="text" className="form-control" id="notes" name="notes" defaultValue={initialData?.notes ?? ''} />
    <label className="form-label" htmlFor="dependency">Dependency</label>
    <input type="range" className="form-range" min="0" max="100" id="dependency" name="dependency" defaultValue={initialData?.dependency}></input>
    <button type="submit" className="btn btn-outline-light">Submit</button><br />
  </form>
  );
};

export default ProblemForm;
