const API="http://localhost:8081";

let students=[];
let courses=[];
let enrollments=[];
let filteredStudents=[];

let currentPage=1;
let pageSize=5;

const $=id=>document.getElementById(id);

document.addEventListener("DOMContentLoaded",()=>{
loadStudents();
loadCourses();
loadEnrollments();
});

function show(id){
document.querySelectorAll("section").forEach(s=>s.classList.add("hide"));
$(id).classList.remove("hide");
}

async function loadStudents(){
try{
let r=await fetch(API+"/students");
students=await r.json();
filteredStudents=[...students];
displayStudents();
studentOptions();
courseFilterOptions();
dashboard();
}catch(e){
console.log(e);
}
}

function displayStudents(){
$("studentTable").innerHTML="";

let start=(currentPage-1)*pageSize;
let list=filteredStudents.slice(start,start+pageSize);

list.forEach(s=>{
$("studentTable").innerHTML+=`
<tr>
<td>${s.id}</td>
<td>${s.name}</td>
<td>${s.email}</td>
<td>${s.phone}</td>
<td>${s.dateOfJoining}</td>
<td>
<button class="edit" onclick="editStudent(${s.id})">Edit</button>
<button class="delete" onclick="deleteStudent(${s.id})">Delete</button>
</td>
</tr>`;
});

let pages=Math.ceil(filteredStudents.length/pageSize)||1;

if(currentPage>pages){
currentPage=pages;
displayStudents();
return;
}

$("pageNumber").textContent=`Page ${currentPage} of ${pages}`;
}

function applyFilter(){
let text=$("search").value.toLowerCase();
let course=$("courseFilter").value;

filteredStudents=students.filter(s=>{

let searchMatch=
s.name.toLowerCase().includes(text)||
s.email.toLowerCase().includes(text)||
s.phone.includes(text);

if(!course)return searchMatch;

return searchMatch&&enrollments.some(e=>
e.student.id==s.id&&e.course.id==course
);
});

currentPage=1;
displayStudents();
}

function searchStudents(){
applyFilter();
}

function filterStudents(){
applyFilter();
}

function courseFilterOptions(){
$("courseFilter").innerHTML=
"<option value=''>All Courses</option>";

courses.forEach(c=>{
$("courseFilter").innerHTML+=
`<option value="${c.id}">${c.courseName}</option>`;
});
}

function previousPage(){
if(currentPage>1){
currentPage--;
displayStudents();
}
}

function nextPage(){
let pages=Math.ceil(filteredStudents.length/pageSize);

if(currentPage<pages){
currentPage++;
displayStudents();
}
}

function studentOptions(){

$("studentCourse").innerHTML=
"<option value=''>Select Course</option>";

$("enrollmentStudent").innerHTML=
"<option value=''>Select Student</option>";

$("enrollmentCourse").innerHTML=
"<option value=''>Select Course</option>";

courses.forEach(c=>{

$("studentCourse").innerHTML+=
`<option value="${c.id}">${c.courseName}</option>`;

$("enrollmentCourse").innerHTML+=
`<option value="${c.id}">${c.courseName}</option>`;

});

students.forEach(s=>{
$("enrollmentStudent").innerHTML+=
`<option value="${s.id}">${s.name}</option>`;
});
}

$("studentForm").onsubmit=async e=>{
e.preventDefault();

let name=$("studentName").value.trim();
let email=$("studentEmail").value.trim();
let phone=$("studentPhone").value.trim();
let date=$("dateOfJoining").value;
let course=$("studentCourse").value;
let id=$("studentId").value;

$("studentMsg").style.color="red";

if(!name)
return $("studentMsg").textContent="Name is required";

if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
return $("studentMsg").textContent="Enter valid email";

if(!/^[0-9]{10}$/.test(phone))
return $("studentMsg").textContent="Phone must be 10 digits";

if(!date)
return $("studentMsg").textContent="Date is required";

if(!id&&!course)
return $("studentMsg").textContent="Select course";

let r=await fetch(
API+"/students"+(id?"/"+id:""),
{
method:id?"PUT":"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
name:name,
email:email,
phone:phone,
dateOfJoining:date
})
});

let data=await r.json();

if(!r.ok){
$("studentMsg").textContent=data.message||"Error";
return;
}

if(!id&&course){

let er=await fetch(
API+`/enrollments?studentId=${data.id}&courseId=${course}&enrollmentDate=${date}`,
{method:"POST"}
);

if(!er.ok){
console.log("Enrollment failed");
}
}

$("studentMsg").style.color="green";
$("studentMsg").textContent=
id?"Student updated":"Student added successfully";

$("studentForm").reset();
$("studentId").value="";

await loadStudents();
await loadEnrollments();
};

function editStudent(id){

let s=students.find(x=>x.id==id);

if(!s)return;

$("studentId").value=s.id;
$("studentName").value=s.name;
$("studentEmail").value=s.email;
$("studentPhone").value=s.phone;
$("dateOfJoining").value=s.dateOfJoining;

show("students");
}

async function deleteStudent(id){

if(!confirm("Delete this student?"))
return;

await fetch(
API+"/students/"+id,
{method:"DELETE"}
);

await loadStudents();
await loadEnrollments();
}

async function loadCourses(){

try{

let r=await fetch(API+"/courses");
courses=await r.json();

displayCourses();
studentOptions();
courseFilterOptions();
dashboard();

}catch(e){
console.log(e);
}
}

function displayCourses(){

$("courseTable").innerHTML="";

courses.forEach(c=>{
$("courseTable").innerHTML+=`
<tr>
<td>${c.id}</td>
<td>${c.courseName}</td>
<td>${c.duration}</td>
<td>
<button class="edit" onclick="editCourse(${c.id})">Edit</button>
<button class="delete" onclick="deleteCourse(${c.id})">Delete</button>
</td>
</tr>`;
});
}

$("courseForm").onsubmit=async e=>{
e.preventDefault();

let name=$("courseName").value.trim();
let duration=$("courseDuration").value.trim();
let id=$("courseId").value;

$("courseMsg").style.color="red";

if(!name)
return $("courseMsg").textContent="Course name is required";

if(!duration)
return $("courseMsg").textContent="Duration is required";

let r=await fetch(
API+"/courses"+(id?"/"+id:""),
{
method:id?"PUT":"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
courseName:name,
duration:duration
})
});

if(!r.ok){
$("courseMsg").textContent="Error";
return;
}

$("courseMsg").style.color="green";
$("courseMsg").textContent=
id?"Course updated":"Course added successfully";

$("courseForm").reset();
$("courseId").value="";

await loadCourses();
};

function editCourse(id){

let c=courses.find(x=>x.id==id);

if(!c)return;

$("courseId").value=c.id;
$("courseName").value=c.courseName;
$("courseDuration").value=c.duration;

show("courses");
}

async function deleteCourse(id){

if(!confirm("Delete this course?"))
return;

await fetch(
API+"/courses/"+id,
{method:"DELETE"}
);

await loadCourses();
}

$("enrollmentForm").onsubmit=async e=>{
e.preventDefault();

let student=$("enrollmentStudent").value;
let course=$("enrollmentCourse").value;
let date=$("enrollmentDate").value;

$("enrollmentMsg").style.color="red";

if(!student)
return $("enrollmentMsg").textContent="Select student";

if(!course)
return $("enrollmentMsg").textContent="Select course";

if(!date)
return $("enrollmentMsg").textContent="Select date";

let r=await fetch(
API+`/enrollments?studentId=${student}&courseId=${course}&enrollmentDate=${date}`,
{method:"POST"}
);

let data=await r.json();

if(!r.ok){
$("enrollmentMsg").textContent=
data.message||
"Student is already enrolled in this course";
return;
}

$("enrollmentMsg").style.color="green";
$("enrollmentMsg").textContent=
"Student enrolled successfully";

$("enrollmentForm").reset();

await loadEnrollments();
};

async function loadEnrollments(){

try{

let r=await fetch(API+"/enrollments");
enrollments=await r.json();

displayEnrollments();
dashboard();

if(!$("students").classList.contains("hide")){
applyFilter();
}

}catch(e){
console.log(e);
}
}

function displayEnrollments(){

$("enrollmentTable").innerHTML="";

enrollments.forEach(e=>{
$("enrollmentTable").innerHTML+=`
<tr>
<td>${e.student.name}</td>
<td>${e.course.courseName}</td>
<td>${e.enrollmentDate}</td>
</tr>`;
});
}

function dashboard(){

$("totalStudents").textContent=students.length;
$("totalCourses").textContent=courses.length;
$("totalEnrollments").textContent=enrollments.length;

let html="<h3>Course-wise Enrollment</h3>";

courses.forEach(c=>{

let count=enrollments.filter(
e=>e.course.id==c.id
).length;

html+=`
<p>${c.courseName}: ${count}</p>
`;
});

$("courseCounts").innerHTML=html;
}

function csvValue(value){

value=String(value);

if(
value.includes(",")||
value.includes('"')||
value.includes("\n")
){
return `"${value.replace(/"/g,'""')}"`;
}

return value;
}

function downloadCSV(data,name){

let blob=new Blob(
[data],
{type:"text/csv"}
);

let url=URL.createObjectURL(blob);

let a=document.createElement("a");

a.href=url;
a.download=name;

document.body.appendChild(a);
a.click();
document.body.removeChild(a);

URL.revokeObjectURL(url);
}

function exportStudents(){

if(!students.length){
alert("No students available");
return;
}

let csv=
"ID,Name,Email,Phone,Date of Joining\n";

students.forEach(s=>{
csv+=
`${s.id},${csvValue(s.name)},${csvValue(s.email)},${csvValue(s.phone)},${csvValue(s.dateOfJoining)}\n`;
});

downloadCSV(csv,"students.csv");
}

function exportEnrollments(){

if(!enrollments.length){
alert("No enrollments available");
return;
}

let csv=
"Student,Course,Enrollment Date\n";

enrollments.forEach(e=>{
csv+=
`${csvValue(e.student.name)},${csvValue(e.course.courseName)},${csvValue(e.enrollmentDate)}\n`;
});

downloadCSV(csv,"enrollments.csv");
}