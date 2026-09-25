import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Course } from '../../types';

export const CoursesView: React.FC = () => {
  const { courses, updateLead, showToast } = useCrm();

  const [courseList, setCourseList] = useState<Course[]>(courses);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // New course state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('School of Computing');
  const [duration, setDuration] = useState('3 Years');
  const [fees, setFees] = useState('₹4,00,000 Total');
  const [totalSeats, setTotalSeats] = useState(120);

  const toggleCourseStatus = (id: string) => {
    setCourseList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(`${c.code} status changed to ${nextStatus}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      showToast('Course name and code are required', undefined, 'warning');
      return;
    }

    const newC: Course = {
      id: `course-${Date.now()}`,
      name,
      code,
      department,
      duration,
      fees,
      feeAmount: 400000,
      availableSeats: totalSeats,
      totalSeats,
      status: 'ACTIVE',
      totalLeads: 0,
      applications: 0,
      admissions: 0,
      conversionRate: 0,
    };

    setCourseList([newC, ...courseList]);
    setIsAddCourseModalOpen(false);
    showToast(`Course ${code} added to institution catalog!`);
    setName('');
    setCode('');
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">school</span>
            <h2 className="font-bold text-base md:text-lg text-[#131b2e]">Academic Programs & Courses</h2>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Manage course capacities, tuition fees, and admission performance metrics
          </p>
        </div>
        <button
          onClick={() => setIsAddCourseModalOpen(true)}
          className="px-3 py-2 bg-[#004ac6] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-[#003ea8] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Course</span>
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courseList.map((course) => {
          const seatOccupancy = Math.round(((course.totalSeats - course.availableSeats) / course.totalSeats) * 100);

          return (
            <div
              key={course.id}
              className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#dbe1ff] text-[#004ac6] uppercase font-mono">
                      {course.code}
                    </span>
                    <h3 className="font-bold text-sm text-[#131b2e] mt-1">{course.name}</h3>
                    <p className="text-xs text-[#737686]">{course.department} • {course.duration}</p>
                  </div>
                  <button
                    onClick={() => toggleCourseStatus(course.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                      course.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#f2f3ff] text-[#737686]'
                    }`}
                  >
                    {course.status}
                  </button>
                </div>

                <div className="mt-2 text-xs font-semibold text-[#004ac6]">
                  Tuition: {course.fees}
                </div>
              </div>

              {/* Seat Capacity Bar */}
              <div>
                <div className="flex justify-between text-[11px] mb-1 text-[#434655]">
                  <span>Seat Occupancy ({seatOccupancy}%)</span>
                  <span>
                    <strong>{course.availableSeats}</strong> / {course.totalSeats} Available
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${seatOccupancy >= 80 ? 'bg-[#ba1a1a]' : 'bg-[#004ac6]'}`}
                    style={{ width: `${seatOccupancy}%` }}
                  ></div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-4 gap-1 p-2 bg-[#f2f3ff] rounded-lg text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#737686] block">Leads</span>
                  <strong className="text-[#131b2e]">{course.totalLeads}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">Apps</span>
                  <strong className="text-[#131b2e]">{course.applications}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">Admitted</span>
                  <strong className="text-emerald-700">{course.admissions}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">Conv.</span>
                  <strong className="text-[#004ac6]">{course.conversionRate}%</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddCourseModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-3 border border-[#eaedff]">
            <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
              <h3 className="font-bold text-base text-[#131b2e]">Add Academic Course</h3>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#434655]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#131b2e] block mb-1">Course Title *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. M.Sc Artificial Intelligence"
                  className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#131b2e] block mb-1">Course Code *</label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="e.g. MSC-AI"
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#131b2e] block mb-1">Department</label>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#131b2e] block mb-1">Duration</label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2 Years"
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#131b2e] block mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#131b2e] block mb-1">Tuition Fees</label>
                <input
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  placeholder="₹4,50,000 Total"
                  className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#004ac6] text-white text-xs font-bold shadow-xs hover:bg-[#003ea8]"
              >
                Save Course to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
