(()=>{async function e(e){try{var t;let u=await fetch(`/admin/offers/${e}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!u.ok)throw Error(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} HTTP: ${u.status}`);t=await u.json(),$("#offerTitle").text(`\u{41F}\u{440}\u{43E}\u{441}\u{43C}\u{43E}\u{442}\u{440} \u{438}\u{43D}\u{444}\u{43E}\u{440}\u{43C}\u{430}\u{446}\u{438}\u{438} \u{43F}\u{43E} \u{437}\u{430}\u{44F}\u{432}\u{43A}\u{435} ${t.userId}`),$("#offerTopic").text(t.topic),$("#offerDescriptionBody").text(t.description),new bootstrap.Modal(document.getElementById("offerContentModal")).show()}catch(e){console.error("Ошибка при получении данных заявки:",e),alert("Не удалось загрузить данные заявки")}}document.getElementById("offerContentModal").addEventListener("hidden.bs.modal",function(){document.getElementById("modalUserId").textContent="",document.getElementById("modalTopic").textContent="",document.getElementById("modalDescription").textContent=""}),window.getOfferDescription=e,window.switchToView=function(e){$(".view-content").addClass("d-none"),$(`.${e}`).removeClass("d-none")},document.addEventListener("DOMContentLoaded",function(){let e=document.getElementById("addCourseForm"),t=document.getElementById("courseDescription"),u=document.getElementById("charCount"),n=document.getElementById("uploadPlaceholder"),a=document.getElementById("courseImage"),s=document.getElementById("imagePreview"),l=document.getElementById("removeImage"),o=document.getElementById("courseTitle"),i=document.getElementById("courseSlug");t.addEventListener("input",function(){let e=this.value.length;u.textContent=e,e>1900?u.classList.add("text-warning"):u.classList.remove("text-warning")}),n.addEventListener("click",function(){a.click()}),a.addEventListener("change",function(e){if(this.files&&this.files[0]){let e=this.files[0];if(e.size>5242880){showAlert("Файл слишком большой. Максимальный размер: 5MB","error"),this.value="";return}let t=new FileReader;t.onload=function(e){s.querySelector("img").src=e.target.result,s.style.display="block",n.style.display="none"},t.readAsDataURL(e)}}),l.addEventListener("click",function(){a.value="",s.style.display="none",n.style.display="block"});let r=!1;o&&i&&(o.addEventListener("input",()=>{r||function(){let e=o.value.trim();if(e){let t={а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"},u=e.toLowerCase(),n="";for(let e=0;e<u.length;e++)n+=t[u[e]]||u[e];i.value=u=n.replace(/['"’]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"")}}()}),i.addEventListener("input",()=>{r=!0})),window.resetForm=function(){e.reset(),e.classList.remove("was-validated"),u.textContent="0",a.value="",s.style.display="none",n.style.display="block"},e.addEventListener("submit",async function(t){if(t.preventDefault(),t.stopPropagation(),!e.checkValidity())return void e.classList.add("was-validated");if(0===a.files.length)return void showAlert("Пожалуйста, выберите изображение для курса.","error");let u=e.querySelector('button[type="submit"]'),n=u.innerHTML;try{u.disabled=!0,u.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Создание...';let t=new FormData(e),n=await fetch("/admin/course/create",{method:"POST",body:t});if(201===n.status)showAlert("Курс успешно создан!","success"),window.resetForm();else{let e=await n.json();return e.error||Object.values(e).join(", "),null}}catch(e){showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${e.message}`,"error")}finally{u.disabled=!1,u.innerHTML=n}})});let t=1,u=1,n=0,a=10;async function s(e=1){try{var l;let s,o=await fetch(`/admin/courses?page=${e}&size=${a}`);if(!o.ok)return null;let r=await o.json();if(!r.success||!r.data||!r.data.content)return null;t=r.data.currentPage||e,u=r.data.totalPages||1,n=r.data.totalItems||r.data.content.length,l=r.data.content,(s=document.querySelector("#courses-edit-tab .card-body"))&&(s.innerHTML="",s.innerHTML=`
        <div class="data-table courses-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432}</h3>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">\u{41E}\u{442}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{430}\u{442}\u{44C}</span>
                            <select class="form-select" id="pageSizeSelect" onchange="changeCoursesPerPage(this.value)">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openAddCourseForm()">
                        <i class="bi bi-plus-circle me-1"></i>\u{41D}\u{43E}\u{432}\u{44B}\u{439} \u{43A}\u{443}\u{440}\u{441}
                    </button>
                </div>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">URI</div>
                    <div class="table-cell">\u{421}\u{442}\u{430}\u{442}\u{443}\u{441}</div>
                    <div class="table-cell">\u{421}\u{43E}\u{437}\u{434}\u{430}\u{43D}</div>
                    <div class="table-cell">\u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>

                ${l.length>0?l.map(e=>{var t,u,n;let a,s,l;return`
                <div class="table-row" id="course-row-${e.id}">
                    <div class="table-cell text-muted">#${e.id||"N/A"}</div>
                    <div class="table-cell">
                        <img src="/img/course-brand/${e.image}" alt="\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}"
                             class="course-image" data-image-name="${e.image}" onclick="openViewCourseImageModal('${e.image}')" style="cursor: pointer">
                    </div>
                    <div class="table-cell">
                        <div class="fw-bold">${e.title||"N/A"}</div>
                    </div>
                    <div class="table-cell">
                        <span class="course-description">${e.description||"N/A"}</span>
                    </div>
                    <div class="table-cell">
                        ${t=e,"ACTIVE"===t.status?`<code class="click-for-redirect" style="cursor: pointer">/course/${t.slug}</code>`:`<p>\u{41D}\u{435}\u{432}\u{43E}\u{437}\u{43C}\u{43E}\u{436}\u{43D}\u{43E} \u{43F}\u{440}\u{43E}\u{441}\u{43C}\u{43E}\u{442}\u{440}\u{435}\u{442}\u{44C} \u{43A}\u{443}\u{440}\u{441}</p>`}
                    </div>
                    <div class="table-cell" data-course-id="${e.id}">
                    ${u=e.status,n=e.id,s=(a={ACTIVE:{text:"Активный",bg:"success"},INACTIVE:{text:"Неактивный",bg:"secondary"},ARCHIVED:{text:"В архиве",bg:"dark"}})[u]||{text:"Неизвестно",bg:"light"},l=Object.keys(a).map(e=>{if(e===u)return"";let t=a[e];return`<li><a class="dropdown-item" href="#" onclick="event.preventDefault(); updateCourseStatus(${n}, '${s.text}', '${e}', '${t.text}')">${t.text}</a></li>`}).join(""),`
        <div class="dropdown">
            <button class="btn btn-sm dropdown-toggle badge rounded-pill text-bg-${s.bg}" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${s.text}
            </button>
            <ul class="dropdown-menu">
                ${l}
            </ul>
        </div>
    `}
                    </div>
                    <div class="table-cell text-sm text-muted">${i(e.createdAt)}</div>
                    <div class="table-cell text-sm text-muted">${i(e.updatedAt)}</div>
                    <div class="table-cell action-buttons">
                        <button class="btn btn-primary btn-icon btn-sm" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" onclick="openEditCourseModal(${e.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-primary btn-icon btn-sm" title="\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438}" onclick="showCourseModules(${e.id}, '${e.title}')">
                            \u{41C}
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" onclick="deleteCourse(${e.id}, '${e.title}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `}).join(""):`
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="bi bi-journal-x me-2"></i>
                        \u{41A}\u{443}\u{440}\u{441}\u{44B} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}
                    </div>
                </div>
                `}
            </div>
        </div>

        <div class="pagination-container-edit-course mt-3"></div>
    `,document.getElementById("pageSizeSelect").value=a,s.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(e=>{new bootstrap.Dropdown(e)}),s.querySelectorAll(".table-cell").forEach(e=>{e.style.overflow="visible"})),function(){let e=document.querySelector(".pagination-container-edit-course");if(!e)return;if(u<=1){e.innerHTML="";return}let a=`
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${1===t?"disabled":""}">
                    <a class="page-link" href="#" onclick="changePage(${t-1}); return false;">&laquo;</a>
                </li>
    `,s=Math.max(1,t-Math.floor(2.5)),l=Math.min(u,s+5-1);l-s+1<5&&(s=Math.max(1,l-5+1)),s>1&&(a+='<li class="page-item"><a class="page-link" href="#" onclick="changePage(1); return false;">1</a></li>',s>2&&(a+='<li class="page-item disabled"><span class="page-link">...</span></li>'));for(let e=s;e<=l;e++)a+=`<li class="page-item ${e===t?"active":""}"><a class="page-link" href="#" onclick="changePage(${e}); return false;">${e}</a></li>`;l<u&&(l<u-1&&(a+='<li class="page-item disabled"><span class="page-link">...</span></li>'),a+=`<li class="page-item"><a class="page-link" href="#" onclick="changePage(${u}); return false;">${u}</a></li>`),e.innerHTML=a+`
                <li class="page-item ${t===u?"disabled":""}">
                    <a class="page-link" href="#" onclick="changePage(${t+1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">\u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${t} \u{438}\u{437} ${u} \u{2022} \u{412}\u{441}\u{435}\u{433}\u{43E} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432}: ${n}</small>
        </div>
    `}()}catch(e){showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{437}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{438} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432} ${e}`,"error")}}async function l(e,u){if(!confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C} \u{43A}\u{443}\u{440}\u{441} "${u}"? \u{42D}\u{442}\u{43E} \u{434}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{438}\u{442} \u{432}\u{441}\u{435} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{438} \u{443}\u{440}\u{43E}\u{43A}\u{438} \u{44D}\u{442}\u{43E}\u{433}\u{43E} \u{43A}\u{443}\u{440}\u{441}\u{430}, \u{438} \u{435}\u{433}\u{43E} \u{43D}\u{435}\u{43B}\u{44C}\u{437}\u{44F} \u{431}\u{443}\u{434}\u{435}\u{442} \u{43E}\u{442}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{44C}.`))return null;try{let n=await fetch(`/admin/courses/${e}/delete`,{method:"DELETE",headers:{"Content-Type":"application/json"}});if(await n.json().catch(()=>({})),!n.ok)return null;showAlert(`\u{41A}\u{443}\u{440}\u{441} "${u}" \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}!`,"success"),setTimeout(()=>{s(t||1)},1500)}catch(e){showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${e.message}`,"error")}}async function o(e,u,n,a){if(confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{438}\u{437}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{44C} \u{441}\u{442}\u{430}\u{442}\u{443}\u{441} \u{43A}\u{443}\u{440}\u{441}\u{430} \u{441} "${u}" \u{43D}\u{430} "${a}"?`))try{let u=await fetch("/admin/courses/update/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({courseId:e,status:n})}),l=await u.json().catch(()=>({}));if(u.ok&&l.success)showAlert(`\u{421}\u{442}\u{430}\u{442}\u{443}\u{441} \u{43A}\u{443}\u{440}\u{441}\u{430} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{438}\u{437}\u{43C}\u{435}\u{43D}\u{435}\u{43D} \u{43D}\u{430} "${a}"!`,"success"),await s(t);else{let e=l.error||`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${u.status}`;throw Error(e)}}catch(e){showAlert(e.message,"error")}}function i(e){if(!e)return"Не указано";try{return new Date(e).toLocaleDateString("ru-RU",{year:"numeric",month:"2-digit",day:"2-digit"})}catch(t){return e}}function r(){document.getElementById("viewImageModal")||(document.getElementById("img-view-modal").innerHTML+=`
            <div class="modal fade" id="viewImageModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div class="modal-body text-center">
                            <img id="modalImgCourse" class="img-fluid" style="max-height: 70vh; object-fit: contain;">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
                        </div>
                    </div>
                </div>
            </div>
        `)}function d(){if(document.getElementById("editCourseModal"))return;let e=`
        <div class="modal fade" id="editCourseModal" tabindex="-1" aria-labelledby="editCourseModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editCourseModalLabel">\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C} \u{43A}\u{443}\u{440}\u{441}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editCourseForm" onsubmit="handleCourseUpdate(event)">
                            <input type="hidden" id="editCourseId" name="id">
                            
                            <div class="mb-3">
                                <label for="editCourseTitle" class="form-label">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</label>
                                <input type="text" class="form-control" id="editCourseTitle" name="title" required minlength="2" maxlength="100">
                            </div>
                            
                            <div class="mb-3">
                                <label for="editCourseDescription" class="form-label">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</label>
                                <textarea class="form-control" id="editCourseDescription" name="description" rows="3" required minlength="2" maxlength="100"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="editCourseSlug" class="form-label">URI (Slug)</label>
                                <input type="text" class="form-control" id="editCourseSlug" name="slug" required minlength="2" maxlength="100">
                            </div>

                            <div class="mb-3">
                                <label for="editCourseImage" class="form-label">\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}</label>
                                <input class="form-control" type="file" id="editCourseImage" name="image" accept="image/png, image/jpeg, image/gif">
                                <div class="mt-2">
                                    <small class="text-muted">\u{422}\u{435}\u{43A}\u{443}\u{449}\u{435}\u{435} \u{438}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435}:</small>
                                    <img id="currentCourseImage" src="" alt="Current Image" class="img-thumbnail mt-1" style="max-width: 150px;">
                                </div>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{41E}\u{442}\u{43C}\u{435}\u{43D}\u{430}</button>
                                <button type="submit" class="btn btn-primary">\u{421}\u{43E}\u{445}\u{440}\u{430}\u{43D}\u{438}\u{442}\u{44C} \u{438}\u{437}\u{43C}\u{435}\u{43D}\u{435}\u{43D}\u{438}\u{44F}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;document.body.insertAdjacentHTML("beforeend",e)}async function c(e){let t=document.getElementById("editCourseModal");if(!t)return;let u=document.getElementById(`course-row-${e}`);if(!u)return void showAlert("Не удалось найти данные для курса.","error");let n=u.querySelector(".fw-bold").textContent.trim(),a=u.querySelector(".course-description").textContent.trim(),s=u.querySelector("code").textContent.replace("/courses/","").trim(),l=u.querySelector(".course-image").src;document.getElementById("editCourseId").value=e,document.getElementById("editCourseTitle").value=n,document.getElementById("editCourseDescription").value=a,document.getElementById("editCourseSlug").value=s,document.getElementById("currentCourseImage").src=l,document.getElementById("editCourseImage").value="",new bootstrap.Modal(t).show()}async function m(e){e.preventDefault();let u=new FormData(e.target);u.get("id");let n=u.get("title");try{let e=await fetch("/admin/courses/update",{method:"POST",headers:{},body:u}),a=await e.json().catch(()=>({}));if(!e.ok||!a.success)return a.error||e.status,null;showAlert(`\u{41A}\u{443}\u{440}\u{441} "${n}" \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}!`,"success"),bootstrap.Modal.getInstance(document.getElementById("editCourseModal")).hide(),s(t)}catch(e){showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{43E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${e.message}`,"error")}}document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector('a[data-tab="courses-edit-tab"]'),t=document.getElementById("courses-edit-tab");if(t&&t.addEventListener("click",function(e){if(e.target&&e.target.classList.contains("click-for-redirect")){let t=e.target.textContent.trim();t&&(window.location.href=t)}}),e){let t=!1;e.addEventListener("click",()=>{t||(s(1),r(),d(),t=!0)}),document.getElementById("courses-edit-tab")?.classList.contains("active")&&(s(1),r(),d(),t=!0)}}),window.openAddCourseForm=function(){let e=document.querySelector('a[data-tab="courses-add-tab"]');e?e.click():showAlert("Не удалось найти вкладку для добавления курса","error")},window.changeCoursesPerPage=function(e){a=parseInt(e)||10,s(1)},window.deleteCourse=l,window.changePage=function(e){e<1||e>u||e===t||s(e)},window.openViewCourseImageModal=function(e){document.getElementById("viewImageModal")||r();let t=document.getElementById("modalImgCourse");t&&(t.src=`/img/course-brand/${e}`,t.alt=`\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}: ${e}`);let u=document.getElementById("viewImageModal");u&&new bootstrap.Modal(u).show()},window.openEditCourseModal=c,window.handleCourseUpdate=m,window.updateCourseStatus=o,window.loadCourses=s;let p=null,g=[];async function f(e){try{let t=await fetch(`/admin/courses/${e}/modules`);if(!t.ok)return void(404===t.status?showAlert("В этом модуле нет курсов","info"):showAlert("Ошибка загрузки модулей курса","error"));let u=await t.json();if(!u.success||!Array.isArray(u.data)){showAlert(u.message||"Модулей нет","info"),g=[],p={id:e,name:"Неизвестный курс"};return}g=u.data||[],p={id:e,name:g.length>0?g[0].courseName:"Неизвестный курс"},function e(){let t=document.getElementById("courseModulesModal");if(!t){let t;return void(t=`
        <div class="modal fade" id="courseModulesModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{43A}\u{443}\u{440}\u{441}\u{430}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted" id="modulesCount">\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}: 0</span>
                        </div>
                        
                        <div id="modulesList" class="modules-list">
                            <div class="text-center py-4 text-muted">
                                <i class="fas fa-spinner fa-spin me-2"></i>
                                \u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}...
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
                        <button type="button" class="btn btn-primary" onclick="manageCourse(${p?.id})">
                            \u{423}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{43C}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,document.body.insertAdjacentHTML("beforeend",t),e())}let u=t.querySelector(".modal-title");u&&(u.textContent=`\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{43A}\u{443}\u{440}\u{441}\u{430}: ${p.name}`),g.length>0&&(document.getElementById("modulesCount").innerText=`\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}: ${g.length}`);let n=t.querySelector("#modulesList");n&&(n.innerHTML=g.length>0?g.map((e,t)=>`
        <div class="module-item" data-module-id="${e.moduleId}">
            <div class="module-header d-flex justify-content-between align-items-center">
                <div class="module-info">
                    <h6 class="module-title mb-1">${e.order||t+1}. ${function(e){if(null==e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}(e.moduleTitle||"Без названия")}</h6>
                    <small class="text-muted">ID: ${e.moduleId} </small>
                </div>
                <div class="module-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editModule(${e.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <a class="btn btn-sm btn-outline-danger" href="/admin/modules">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </div>
            <hr class="my-2">
        </div>
    `).join(""):'<div class="text-center py-4 text-muted">Модули не найдены</div>')}();let n=document.getElementById("courseModulesModal");if(!n)return null;new bootstrap.Modal(n).show()}catch(e){}}document.addEventListener("DOMContentLoaded",function(){document.addEventListener("hidden.bs.modal",function(e){"courseModulesModal"===e.target.id&&(p=null,g=[])})}),window.addNewModule=function(){alert(`\u{414}\u{43E}\u{431}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{435} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F} \u{434}\u{43B}\u{44F} \u{43A}\u{443}\u{440}\u{441}\u{430}: ${p?.name}`)},window.editModule=function(e){showAlert(`\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{43D}\u{438}\u{435} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}: ${e}`,"info")},window.manageCourse=function(e){window.location.href=`/admin/courses/${e}/edit`},window.showCourseModules=function(e,t){f(e,t)},document.addEventListener("DOMContentLoaded",function(){let e=new bootstrap.Modal(document.getElementById("editLessonModal")),t=document.getElementById("editLessonForm");document.body.addEventListener("click",async function(t){let u=t.target.closest(".edit-lesson-btn");if(u){let t=u.dataset.lessonId;if(!t)return;try{let u=await fetch(`/api/admin/lessons/${t}`),n=await u.json();if(!u.ok||!n.success){let e=n.message||"Не удалось загрузить данные урока.";showAlert(e,"error");return}let a=n.data;document.getElementById("editLessonId").value=t,document.getElementById("editLessonTitle").value=a.title,document.getElementById("editLessonVideoUrl").value=a.videoUrl,function(e=""){tinymce.remove("#editLessonTextContent"),tinymce.init({selector:"#editLessonTextContent",plugins:"code table lists image link",toolbar:"undo redo | blocks | bold italic | alignleft aligncenter alignright | indent outdent | bullist numlist | code | image | link",height:400,setup:function(t){t.on("init",function(){t.setContent(e)})}})}(a.textContent||""),e.show()}catch(e){showAlert(e.message,"error")}}}),t.addEventListener("submit",async function(t){t.preventDefault();let u=document.getElementById("editLessonId").value,n=document.getElementById("editLessonTitle").value,a=document.getElementById("editLessonVideoUrl").value,s=tinymce.get("editLessonTextContent").getContent();try{let t=await fetch(`/api/admin/lessons/${u}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:n,videoUrl:a,textContent:s})}),l=await t.json();if(!t.ok||!l.success){let e=l.message||"Произошла ошибка при сохранении.";throw Error(e)}e.hide(),showAlert(l.message||"Урок успешно обновлен!","success"),"function"==typeof loadLessons&&loadLessons()}catch(e){showAlert(e.message,"error")}})});let b=[];async function v(){try{let e=await fetch("/admin/modules/json");if(e.ok){let t,u=await e.json();u.success&&u.data&&(b=u.data,(t=document.getElementById("moduleId")).innerHTML='<option value="">Выберите модуль</option>',b.forEach(e=>{let u=document.createElement("option");u.value=e.moduleId,"ACTIVE"===e.moduleStatus?u.textContent=`(\u{41A}\u{443}\u{440}\u{441}: ${e.courseName}) \u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}: ${e.moduleTitle}`:(u.textContent=`\u{41D}\u{415}\u{410}\u{41A}\u{422}\u{418}\u{412}\u{415}\u{41D} (\u{41A}\u{443}\u{440}\u{441}: ${e.courseName}) \u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}: ${e.moduleTitle}`,u.disabled=!0),t.appendChild(u)}))}}catch(e){showAlert("Не удалось загрузить список модулей","error")}}async function h(){if(function(){let e=document.getElementById("createLessonForm");if(!e.checkValidity())return e.reportValidity(),!1;let t=document.getElementById("videoFile");return!t.files[0]||!(t.files[0].size>0xc800000)||(showAlert("Размер файла не должен превышать 200MB","error"),!1)}())try{var e;y(!0);let t=new FormData;t.append("file",document.getElementById("videoFile").files[0]),t.append("moduleId",document.getElementById("moduleId").value),t.append("title",document.getElementById("lessonTitle").value),t.append("description",document.getElementById("description").value),t.append("shortDescription",document.getElementById("shortDescription").value),t.append("testCode",document.getElementById("testCode").value);let u=await fetch("/admin/lesson/upload",{method:"POST",body:t}),n=await u.json();u.ok?(showAlert("Урок успешно создан!","success"),bootstrap.Modal.getInstance(document.getElementById("createLessonModal")).hide(),loadLessons()):(e=n,showAlert(e.message||"Не удалось создать урок","error"),e.message&&e.message.includes("file")&&document.getElementById("videoFile").classList.add("is-invalid"))}catch(e){showAlert("Произошла ошибка при создании урока","error")}finally{y(!1)}}function E(){document.getElementById("createLessonForm").reset(),document.querySelectorAll("#createLessonForm .is-invalid").forEach(e=>{e.classList.remove("is-invalid")})}function y(e){let t=document.getElementById("submitLessonBtn");t&&(e?(t.disabled=!0,t.innerHTML='<i class="fas fa-spinner fa-spin me-1"></i> Создание...'):(t.disabled=!1,t.innerHTML='<i class="fas fa-plus me-1"></i> Создать урок'))}function w(){0===b.length&&v(),new bootstrap.Modal(document.getElementById("createLessonModal")).show()}document.addEventListener("DOMContentLoaded",function(){let e,t,u;v(),e=document.getElementById("submitLessonBtn"),t=document.getElementById("createLessonForm"),e&&e.addEventListener("click",h),t&&t.addEventListener("submit",function(e){e.preventDefault(),h()}),(u=document.getElementById("createLessonModal"))&&u.addEventListener("hidden.bs.modal",E);let n=document.querySelector('[onclick="openCreateLessonModal()"]');n&&n.addEventListener("click",w)});let C=`
#createLessonModal .modal-content {
    background: var(--card-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

#createLessonModal .modal-header {
    background: var(--primary-gradient);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#createLessonModal .modal-title {
    color: white;
    font-weight: 600;
}

#createLessonModal .form-select {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
}

#createLessonModal .form-select option {
    background-color: var(--card-bg);
    color: #e2e8f0;
}

#createLessonModal .form-control:focus,
#createLessonModal .form-select:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: #6366f1;
    box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
    color: #e2e8f0;
}

#createLessonModal .is-invalid {
    border-color: #ef4444 !important;
}

#createLessonModal .form-text {
    color: #94a3b8;
    font-size: 0.875rem;
}
`,I=document.createElement("style");I.textContent=C,document.head.appendChild(I),window.openCreateLessonModal=w,document.addEventListener("DOMContentLoaded",function(){let e=document.getElementById("create-lesson-test-tab");if(!e)return;let t=e.querySelector("#questionsContainer"),u=e.querySelector("#testGeneratorForm"),n=0;function a(){t.querySelectorAll(".question-card").forEach((e,t)=>{e.querySelector(".question-number").textContent=t+1})}function s(){var e;let u,s,l=(e=n,u=`question-${e}`,(s=document.createElement("div")).className="card bg-dark border-secondary mb-4 question-card",s.id=u,s.innerHTML=`
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">\u{412}\u{43E}\u{43F}\u{440}\u{43E}\u{441} <span class="question-number">${e+1}</span></h6>
                <button type="button" class="btn btn-outline-danger btn-sm remove-question-btn">
                    <i class="bi bi-trash"></i> \u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="${u}-text" class="form-label">\u{422}\u{435}\u{43A}\u{441}\u{442} \u{432}\u{43E}\u{43F}\u{440}\u{43E}\u{441}\u{430}:</label>
                    <input type="text" id="${u}-text" class="form-control question-text" placeholder="\u{412}\u{432}\u{435}\u{434}\u{438}\u{442}\u{435} \u{442}\u{435}\u{43A}\u{441}\u{442} \u{432}\u{43E}\u{43F}\u{440}\u{43E}\u{441}\u{430}" required>
                </div>
                <div class="answers-container">
                    <label class="form-label">\u{412}\u{430}\u{440}\u{438}\u{430}\u{43D}\u{442}\u{44B} \u{43E}\u{442}\u{432}\u{435}\u{442}\u{43E}\u{432} (\u{43E}\u{442}\u{43C}\u{435}\u{442}\u{44C}\u{442}\u{435} \u{43F}\u{440}\u{430}\u{432}\u{438}\u{43B}\u{44C}\u{43D}\u{44B}\u{439}):</label>
                    ${[0,1,2].map(e=>`
                        <div class="input-group mb-2">
                            <input type="text" class="form-control answer-text" placeholder="\u{412}\u{430}\u{440}\u{438}\u{430}\u{43D}\u{442} \u{43E}\u{442}\u{432}\u{435}\u{442}\u{430} ${e+1}" required>
                            <div class="input-group-text">
                                <input class="form-check-input correct-answer-radio" type="radio" name="${u}-correct" value="${e}" required>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `,s.querySelector(".remove-question-btn").addEventListener("click",function(){s.remove(),a()}),s);t.appendChild(l),n++,a()}e.addEventListener("click",function(e){e.target&&"addQuestionBtn"===e.target.id&&s()}),u&&u.addEventListener("submit",function(e){e.preventDefault(),function(){let e=t.querySelectorAll(".question-card"),u=[],n=!0;if(0===e.length)return showAlert("Пожалуйста, добавьте хотя бы один вопрос.","info");if(e.forEach(e=>{let t=e.querySelector(".question-text").value,a=e.querySelectorAll(".answer-text"),s=e.querySelector(".correct-answer-radio:checked");t&&s||(n=!1);let l=[];a.forEach((e,t)=>{e.value||(n=!1),l.push({text:e.value,correct:t===parseInt(s.value)})}),u.push({question:t,answers:l})}),!n)return showAlert("Пожалуйста, заполните все текстовые поля и выберите правильный ответ для каждого вопроса.","info");let a=`const questions = [
${u.map(e=>`    {
        question: "${e.question.replace(RegExp('"',"g"),'\\"')}",
        answers: [
${e.answers.map(e=>`            { text: "${e.text.replace(RegExp('"',"g"),'\\"')}", correct: ${e.correct} }`).join(",\n")}
        ]
    }`).join(",\n")}
];`;document.getElementById("generatedCode").textContent=a,document.getElementById("resultContainer").style.display="block",window.generatedCodeForCopy=a}()}),new MutationObserver(u=>{u.forEach(u=>{"class"===u.attributeName&&e.classList.contains("active")&&0===t.children.length&&s()})}).observe(e,{attributes:!0})}),window.copyToClipboard=function(){window.generatedCodeForCopy&&navigator.clipboard.writeText(window.generatedCodeForCopy).then(()=>{showAlert("Код скопирован в буфер обмена!","success")}).catch(e=>{showAlert("Не удалось скопировать код","error")})};let B=1,A=1,M=0,x=5;async function L(){try{let e=await fetch("/admin/modules/json");if(!e.ok)return null;let t=await e.json();if(!t.success||!t.data)return null;{let e=document.getElementById("moduleFilterSelect");if(!e)return;let u=e.value;e.innerHTML='<option value="">Все модули</option>',t.data.forEach(t=>{let u=document.createElement("option");u.value=t.moduleId,u.textContent=`${t.moduleTitle}`,e.appendChild(u)}),u&&(e.value=u)}}catch(e){showAlert("Не удалось загрузить фильтр модулей.","warning")}}async function D(e=1){try{S(!0);let t=document.getElementById("moduleFilterSelect")?.value||"",u=`/admin/lessons?page=${e}&size=${x}`;t&&(u+=`&moduleId=${t}`);let n=await fetch(u);if(n.ok){let t=await n.json();if(t.success&&t.data){let u=t.data;B=u.currentPage||e,A=u.totalPages||1,M=u.totalItems||0,k(u.content),T(u.content)}else showAlert(t.message||"Неверный формат данных","error")}else{if(404!==n.status)return null;k([]),T([])}}catch(e){showAlert(e.message,"error")}finally{S(!1)}}function k(e){let t=document.getElementById("lessonsContainer");if(!t)return;t.innerHTML="";let u=document.createElement("div");u.className="courses-table-container",u.innerHTML=`
        <div class="data-table courses-table lessons-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}</h3>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <!-- NEW: Module Filter -->
                    <div class="filter-group">
                        <select class="form-select form-select-sm" id="moduleFilterSelect" onchange="loadLessons(1)">
                            <option value="">\u{424}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{43F}\u{43E} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44E}...</option>
                        </select>
                    </div>
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">\u{41E}\u{442}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{430}\u{442}\u{44C}</span>
                            <select class="form-select" id="lessonsPageSizeSelect" onchange="changeLessonsPerPage(this.value)">
                                <option value="5" ${5===x?"selected":""}>5</option>
                                <option value="10" ${10===x?"selected":""}>10</option>
                                <option value="20" ${20===x?"selected":""}>20</option>
                                <option value="50" ${50===x?"selected":""}>50</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openCreateLessonModal()">
                        <i class="bi bi-plus-circle me-1"></i>\u{41D}\u{43E}\u{432}\u{44B}\u{439} \u{443}\u{440}\u{43E}\u{43A}
                    </button>
                </div>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}</div>
                    <div class="table-cell">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{412}\u{438}\u{434}\u{435}\u{43E}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>

                ${e.length>0?e.map(e=>{var t;return`
                <div class="table-row">
                    <div class="table-cell text-muted">#${e.id||"N/A"}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${F(e.title||"Без названия")}</div>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${F(e.moduleName||"N/A")}</span>
                    </div>
                    <div class="table-cell">
                        <span class="lesson-description">${t=e.description||"Нет описания",!t||t.length<=100?F(t||""):F(t.substring(0,100))+"..."}</span>
                    </div>
                    <div class="table-cell">
                        ${e.video?`
                            <a href="/admin/video/${e.video}" class="text-primary text-decoration-none">
                                <i class="bi bi-camera-video me-1"></i> \u{421}\u{43C}\u{43E}\u{442}\u{440}\u{435}\u{442}\u{44C}
                            </a>
                        `:'<span class="text-muted">Нет видео</span>'}
                    </div>
                    <div class="table-cell action-buttons">
                        <button class="btn btn-info btn-icon btn-sm edit-lesson-btn" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" data-lesson-id="${e.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}"
                                onclick="deleteLesson(${e.id}, '${F(e.title)}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `}).join(""):`
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="bi bi-book-open me-2"></i>
                        \u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}. \u{418}\u{437}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{435} \u{444}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{438}\u{43B}\u{438} \u{434}\u{43E}\u{431}\u{430}\u{432}\u{44C}\u{442}\u{435} \u{43D}\u{43E}\u{432}\u{44B}\u{439} \u{443}\u{440}\u{43E}\u{43A}.
                    </div>
                </div>
                `}
            </div>
        </div>
    `,t.appendChild(u),L()}function T(e){let t=document.getElementById("lessonsPagination");if(!t)return;if(A<=1){t.innerHTML="";return}let u=`
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${1===B?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${B-1}); return false;">&laquo;</a>
                </li>
    `,n=Math.max(1,B-Math.floor(2.5)),a=Math.min(A,n+5-1);a-n+1<5&&(n=Math.max(1,a-5+1)),n>1&&(u+='<li class="page-item"><a class="page-link" href="#" onclick="changeLessonsPage(1); return false;">1</a></li>',n>2&&(u+='<li class="page-item disabled"><span class="page-link">...</span></li>'));for(let e=n;e<=a;e++)u+=`<li class="page-item ${e===B?"active":""}"><a class="page-link" href="#" onclick="changeLessonsPage(${e}); return false;">${e}</a></li>`;a<A&&(a<A-1&&(u+='<li class="page-item disabled"><span class="page-link">...</span></li>'),u+=`<li class="page-item"><a class="page-link" href="#" onclick="changeLessonsPage(${A}); return false;">${A}</a></li>`),t.innerHTML=u+`
                <li class="page-item ${B===A?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${B+1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                \u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${B} \u{438}\u{437} ${A} \u{2022} \u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{430}\u{43D}\u{43E} ${e.length} \u{438}\u{437} ${M} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}
            </small>
        </div>
    `}function S(e){let t=document.getElementById("lessonsContainer");t&&e&&(t.innerHTML=`
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430}...</span>
                </div>
            </div>
        `)}function F(e){if("string"!=typeof e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}async function j(e,t){if(confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C} \u{443}\u{440}\u{43E}\u{43A} "${t}"?`))try{let u=await fetch(`/admin/lessons/${e}/delete`,{method:"DELETE",headers:{"Content-Type":"application/json"}}),n=await u.json().catch(()=>({}));if(u.ok&&n.success)showAlert(`\u{423}\u{440}\u{43E}\u{43A} "${t}" \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}.`,"success"),D(B||1);else{let e=n.message||`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${u.status}`;showAlert(e,"error")}}catch(e){showAlert(e.message,"error")}}async function P(e){try{let t=await fetch(`/admin/module/${e}`),u=await t.json();if(t.ok&&u.success&&u.data){let e=u.data;document.getElementById("editModuleId").value=e.moduleId,document.getElementById("editModuleTitle").value=e.moduleTitle,document.getElementById("editModuleSlug").value=e.moduleSlug;let t=document.getElementById("editModuleCourseId");await N(t,e.courseName),new bootstrap.Modal(document.getElementById("editModuleModal")).show()}else showAlert(u.message||"Не удалось получить данные модуля.","error")}catch(e){console.error("Ошибка при открытии модального окна:",e),showAlert("Критическая ошибка при загрузке данных модуля.","error")}}async function q(){document.getElementById("editModuleForm");let e=document.getElementById("editModuleId").value,t=bootstrap.Modal.getInstance(document.getElementById("editModuleModal")),u={moduleId:e,name:document.getElementById("editModuleTitle").value,slug:document.getElementById("editModuleSlug").value,courseId:document.getElementById("editModuleCourseId").value};try{let e=await fetch("/admin/modules/update",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="_csrf"]')?.content||document.querySelector('input[name="_csrf"]')?.value},body:JSON.stringify(u)}),n=await e.json();if(e.ok&&"success"===n.status)showAlert(n.message||"Модуль успешно обновлен!","success"),t.hide(),"function"==typeof loadModules&&loadModules(window.currentModulesPage||1);else if(n.errors){let e=Object.values(n.errors).join("\n");showAlert("Ошибка валидации:\n"+e,"error")}else showAlert(n.message||"Не удалось обновить модуль.","error"),console.error(Error(n.message||"Не удалось обновить модуль."))}catch(e){console.error("Ошибка при обновлении модуля:",e),showAlert("Ошибка: "+e.message,"error")}}async function N(e,t){try{let u=await fetch("/admin/courses/all");u.ok||console.error(Error("Не удалось загрузить список курсов."));let n=(await u.json()).data;e.innerHTML='<option value="">Выберите курс</option>',n.forEach(u=>{let n=document.createElement("option");n.value=u.id,n.textContent=u.title,u.title===t&&(n.selected=!0),e.appendChild(n)})}catch(t){console.error(t),e.innerHTML='<option value="">Ошибка загрузки курсов</option>'}}async function H(e){try{let t=await fetch(`/admin/modules/${e}/lessons`);if(t.ok){let e=await t.json();e.success?O(e.data):showAlert(e.message||"Получен неожиданный ответ от сервера.","warning");return}if(404===t.status){showAlert("В этом модуле пока нет уроков.","info"),O([]);return}let u=`HTTP \u{43E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${t.status} ${t.statusText}`;try{let e=await t.json();e&&e.error&&(u=`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{43D}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{435}: ${e.error}`)}catch(e){console.error("Could not parse error JSON.",e)}showAlert(u,"error"),console.error("Failed to load lessons:",u)}catch(e){console.error("Network or fetch error:",e),showAlert("Сетевая ошибка. Не удалось подключиться к серверу.","error")}}function O(e){if(!document.getElementById("lessonsModal")){let e=`
            <div class="modal fade" id="lessonsModal" tabindex="-1" aria-labelledby="lessonsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="lessonsModalLabel">\u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div class="modal-body" id="lessonsModalBody">
                            <!-- Lesson list will be inserted here -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",e)}let t=document.getElementById("lessonsModalBody"),u=document.getElementById("lessonsModalLabel");if(0===e.length)u.textContent="Уроки модуля",t.innerHTML=`
            <div class="text-center py-4">
                <i class="bi bi-book-half fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">\u{412} \u{44D}\u{442}\u{43E}\u{43C} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435} \u{43D}\u{435}\u{442} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}</h5>
                <p class="text-muted">\u{412}\u{44B} \u{43C}\u{43E}\u{436}\u{435}\u{442}\u{435} \u{441}\u{43E}\u{437}\u{434}\u{430}\u{442}\u{44C} \u{43F}\u{435}\u{440}\u{432}\u{44B}\u{439} \u{443}\u{440}\u{43E}\u{43A} \u{432} \u{440}\u{430}\u{437}\u{434}\u{435}\u{43B}\u{435} "\u{423}\u{440}\u{43E}\u{43A}\u{438}".</p>
            </div>
        `;else{let n=e[0]?.moduleName||"Модуль";u.textContent=`\u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}: ${n}`,t.innerHTML=`
            <div class="list-group">
                ${e.map(e=>`
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${e.title||"Без названия"}</h6>
                                <small class="text-muted">ID: ${e.id}</small>
                            </div>
                            <div class="btn-group ms-3">
                                <button class="btn btn-outline-info btn-sm" onclick="viewLesson(${e.id}, '${e.courseSlug}', '${e.moduleSlug}')">
                                    <i class="bi bi-eye"></i> \u{41F}\u{440}\u{43E}\u{441}\u{43C}\u{43E}\u{442}\u{440}\u{435}\u{442}\u{44C}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
            <div class="mt-3">
                <small class="text-muted">\u{412}\u{441}\u{435}\u{433}\u{43E} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}: ${e.length}</small>
            </div>
        `}new bootstrap.Modal(document.getElementById("lessonsModal")).show()}document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector('a[data-tab="lessons-edit-tab"]');e&&(e.addEventListener("click",function(){setTimeout(()=>D(1),10)}),document.getElementById("lessons-edit-tab")?.classList.contains("active")&&D(1))}),window.loadLessons=D,window.changeLessonsPerPage=function(e){x=parseInt(e)||10,D(1)},window.changeLessonsPage=function(e){e<1||e>A||e===B||D(e)},window.deleteLesson=j,document.addEventListener("DOMContentLoaded",function(){document.getElementById("modulesContainer").addEventListener("click",function(e){let t=e.target.closest(".edit-module-btn");t&&P(t.dataset.moduleId)});let e=document.getElementById("editModuleForm");e&&e.addEventListener("submit",async function(e){e.preventDefault(),await q()})}),window.loadCoursesIntoSelect=N,window.submitEditModuleForm=q,window.openEditModuleModal=P,document.addEventListener("DOMContentLoaded",function(){let e=document.getElementById("createModuleForm"),t=document.getElementById("moduleCourseId"),u=document.getElementById("moduleTitle"),n=document.getElementById("moduleSlug");loadCoursesIntoSelect(document.getElementById("moduleCourseId"),null);let a=document.querySelector('a[data-tab="create-module-tab"]');a&&a.addEventListener("click",loadCourses),document.getElementById("create-module-tab")?.classList.contains("active")&&loadCourses(),e&&e.addEventListener("submit",async function(a){if(a.preventDefault(),t.value?u.value.trim()?n.value.trim()?!!/^[a-z0-9-]+$/.test(n.value)||(showAlert("URI может содержать только латинские буквы в нижнем регистре, цифры и дефисы","error"),!1):(showAlert("Пожалуйста, укажите URI модуля","error"),!1):(showAlert("Пожалуйста, введите название модуля","error"),!1):(showAlert("Пожалуйста, выберите курс","error"),!1))try{let a={courseId:t.value,slug:n.value,title:u.value},s=document.querySelector('meta[name="_csrf"]')?.content,l=document.querySelector('meta[name="_csrf_header"]')?.content,o={"Content-Type":"application/json"};s&&l&&(o[l]=s);let i=await fetch("/admin/modules/create",{method:"POST",headers:o,body:JSON.stringify(a)}),r=await i.json();if(i.ok&&"success"===r.status){showAlert(r.message||"Модуль успешно создан!","success"),e.reset();let t=document.querySelector('a[data-tab="modules-edit-tab"]');t&&t.click()}else{if(r.errors){let e=Object.values(r.errors).join("\n");showAlert("Ошибка валидации:\n"+e,"error")}else showAlert(r.message||"Ошибка при создании модуля","error");console.error("Server error:",r.message||r.errors)}}catch(e){console.error("Ошибка отправки:",e),showAlert("Произошла критическая ошибка при отправке данных","error")}});let s=!1;u&&n&&(u.addEventListener("input",()=>{s||function(){let e=u.value.trim();if(e){let t={а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"},u=e.toLowerCase(),a="";for(let e=0;e<u.length;e++)a+=t[u[e]]||u[e];n.value=u=a.replace(/['"’]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"")}}()}),n.addEventListener("input",()=>{s=!0}))}),window.deleteModule=function(e){confirm("Вы уверены, что хотите удалить этот модуль, и все его уроки? Это действие нельзя отменить.")&&fetch(`/admin/module/${e}/delete`,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="_csrf"]')?.content||""}}).then(e=>e.json().then(t=>{if(!e.ok)throw Error(t.message||"Ошибка при удалении модуля");return t})).then(e=>{showAlert(e.message||"Модуль успешно удален","success"),"function"==typeof loadModules&&loadModules(window.currentModulesPage||1)}).catch(e=>{showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${e.message}`,"error"),console.error("Ошибка при удалении модуля:",e)})},window.adminUpdateModuleStatus=function(e,t){confirm("Вы уверены, что хотите обновить статус?")&&(t="ACTIVE"===t?"INACTIVE":"ACTIVE",fetch(`/admin/modules/updateStatus/${e}/${t}`,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="_csrf"]')?.content||""}}).then(e=>e.json().then(t=>{if(!e.ok)throw Error(t.message||"Ошибка при обновлении статуса");return t})).then(e=>{showAlert(e.message,"success"),"function"==typeof loadModules&&loadModules(window.currentModulesPage||1)}).catch(e=>{showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${e.message}`,"error"),console.error("Ошибка при обновлении статуса:",e)}))},window.loadModuleLessons=H,window.viewLesson=function(e,t,u){if(!t||!u)return void showAlert("Недостаточно данных для перехода к уроку (отсутствует slug курса или модуля).","error");let n=`/course/${t}/module/${u}/lesson/${e}`;console.log(`Redirecting to: ${n}`),window.location.href=n};let U=1,R=1,z=0,V=5;function J(){let e=document.getElementById("modulesContainer");e?(e.innerHTML=`
        <div class="data-table courses-table modules-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                 <h3 class="table-title mb-2 mb-md-0">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}</h3>
                 <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="filter-group">
                        <select class="form-select form-select-sm" id="courseFilterSelect" onchange="loadModules(1)">
                            <option value="">\u{424}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{43F}\u{43E} \u{43A}\u{443}\u{440}\u{441}\u{443}...</option>
                        </select>
                    </div>
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">\u{41E}\u{442}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{430}\u{442}\u{44C}</span>
                            <select class="form-select" id="modulesPageSizeSelect" onchange="changeModulesPerPage(this.value)">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                     <button class="btn btn-primary btn-sm" onclick="openCreateModuleModal()">
                        <i class="bi bi-plus-circle me-1"></i>\u{41D}\u{43E}\u{432}\u{44B}\u{439} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}
                    </button>
                </div>
            </div>
            <!-- This container will be updated with new rows -->
            <div class="table-content" id="modules-table-content">
                <!-- Rows will be injected here -->
            </div>
        </div>
    `,document.getElementById("modulesPageSizeSelect").value=V,_(),G(1)):console.error("Module container not found!")}async function _(){let e=document.getElementById("courseFilterSelect");if(e)try{let t=await fetch("/admin/courses/all");if(!t.ok)return console.error(Error("Failed to load courses")),null;let u=await t.json();if(!u.success||!u.data)return console.error(Error("Invalid data format for courses")),null;u.data.forEach(t=>{let u=document.createElement("option");u.value=t.id,u.textContent=t.title,e.appendChild(u)})}catch(e){console.error("Error loading courses for filter:",e),showAlert("Не удалось загрузить фильтр курсов.","warning")}}async function G(e=1){if(!document.getElementById("modules-table-content"))return void J();K(!0);try{let t=document.getElementById("courseFilterSelect")?.value||"",u=`/admin/modules?page=${e}&size=${V}`;t&&(u+=`&courseId=${t}`);let n=await fetch(u),a=await n.json();if(n.ok&&a.success&&a.data&&void 0!==a.data.content){let t=a.data;U=t.currentPage||e,R=t.totalPages||1,z=t.totalItems||0,function(e){let t=document.getElementById("modules-table-content");if(!t)return;t.innerHTML="";let u=`
        <div class="table-row header-row">
            <div class="table-cell">ID</div>
            <div class="table-cell">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</div>
            <div class="table-cell">\u{41A}\u{443}\u{440}\u{441}</div>
            <div class="table-cell">\u{421}\u{442}\u{430}\u{442}\u{443}\u{441}</div>
            <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
        </div>
    `;(t.insertAdjacentHTML("beforeend",u),0===e.length)?t.insertAdjacentHTML("beforeend",`
            <div class="table-row">
                <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                    <i class="bi bi-collection me-2"></i>
                    \u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}. \u{418}\u{437}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{435} \u{444}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{438}\u{43B}\u{438} \u{434}\u{43E}\u{431}\u{430}\u{432}\u{44C}\u{442}\u{435} \u{43D}\u{43E}\u{432}\u{44B}\u{439} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}.
                </div>
            </div>
        `):e.forEach(e=>{var u;let n=`
            <div class="table-row">
                <div class="table-cell text-muted">#${e.moduleId||"N/A"}</div>
                <div class="table-cell">
                    <div class="fw-bold">${W(e.moduleTitle||"Без названия")}</div>
                </div>
                <div class="table-cell">
                    <span class="text-muted">${W(e.courseName||"N/A")}</span>
                </div>
                <div class="table-cell">
                    <span class="badge ${"ACTIVE"===e.moduleStatus?"bg-success":"bg-secondary"}" style="cursor: pointer" onclick="adminUpdateModuleStatus(${e.moduleId}, '${e.moduleStatus}')">
                        ${W((u=e.moduleStatus,"ACTIVE"===u?"Активный":"Неактивный"))}
                    </span>
                </div>
                <div class="table-cell action-buttons">
                    <button class="btn btn-primary btn-icon btn-sm edit-module-btn" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" data-module-id="${e.moduleId}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" onclick="deleteModule(${e.moduleId}, '${W(e.moduleTitle)}')">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-info btn-icon btn-sm" title="\u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}" onclick="loadModuleLessons(${e.moduleId})">
                        <i class="bi bi-card-checklist"></i>
                    </button>
                </div>
            </div>
        `;t.insertAdjacentHTML("beforeend",n)})}(t.content),function(){let e=document.getElementById("modulesPagination");if(!e){let t=document.getElementById("modulesContainer");if(!t)return;{let u=document.createElement("div");u.className="pagination-container mt-3",u.id="modulesPagination",t.appendChild(u),e=u}}if(R<=1){e.innerHTML="";return}let t=`
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${1===U?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${U-1}); return false;">&laquo;</a>
                </li>
    `,u=Math.max(1,U-Math.floor(2.5)),n=Math.min(R,u+5-1);n-u+1<5&&(u=Math.max(1,n-5+1)),u>1&&(t+='<li class="page-item"><a class="page-link" href="#" onclick="changeModulesPage(1); return false;">1</a></li>',u>2&&(t+='<li class="page-item disabled"><span class="page-link">...</span></li>'));for(let e=u;e<=n;e++)t+=`<li class="page-item ${e===U?"active":""}"><a class="page-link" href="#" onclick="changeModulesPage(${e}); return false;">${e}</a></li>`;n<R&&(n<R-1&&(t+='<li class="page-item disabled"><span class="page-link">...</span></li>'),t+=`<li class="page-item"><a class="page-link" href="#" onclick="changeModulesPage(${R}); return false;">${R}</a></li>`),t+=`
                <li class="page-item ${U===R?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${U+1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                \u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${U} \u{438}\u{437} ${R} \u{2022} \u{412}\u{441}\u{435}\u{433}\u{43E} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}: ${z}
            </small>
        </div>
    `,e.innerHTML=t}()}else X(a.message||"Получены неверные данные от сервера.")}catch(e){console.error("Ошибка загрузки модулей:",e),X(e.message)}finally{K(!1)}}function K(e){let t=document.getElementById("modules-table-content");t&&e&&(t.innerHTML=`
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430}...</span>
                </div>
            </div>
        `)}function X(e){let t=document.getElementById("modulesContainer");t&&(t.innerHTML=`
        <div class="text-center py-4 text-danger">
            <i class="bi bi-exclamation-triangle-fill fa-2x mb-3"></i>
            <h5>\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{437}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{438}</h5>
            <p>${W(e)}</p>
            <button class="btn btn-primary btn-sm" onclick="initModulesView()">
                <i class="bi bi-arrow-clockwise me-1"></i> \u{41F}\u{43E}\u{43F}\u{440}\u{43E}\u{431}\u{43E}\u{432}\u{430}\u{442}\u{44C} \u{441}\u{43D}\u{43E}\u{432}\u{430}
            </button>
        </div>
    `)}function W(e){if("string"!=typeof e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector('a[data-tab="modules-edit-tab"]');if(e){let t=!1;new MutationObserver(()=>{document.getElementById("modules-edit-tab").classList.contains("active")&&!t&&(J(),t=!0)}),e.addEventListener("click",()=>{t||(J(),t=!0)}),document.getElementById("modules-edit-tab").classList.contains("active")&&(J(),t=!0)}}),window.changeModulesPerPage=function(e){V=parseInt(e)||10,G(1)},window.openCreateModuleModal=function(){let e=document.querySelector('a[data-tab="create-module-tab"]');e&&e.click()},window.changeModulesPage=function(e){e<1||e>R||e===U||G(e)},window.initModulesView=J,window.loadModules=G;let Q=1,Y=1,Z=0,ee="all",et=10;async function eu(e=1){try{var t;let u,n,a,s,l=await fetch(`/admin/offers?page=${e}&size=${et}&status=${ee}`);l.ok||(console.error(Error(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${l.status}`)),showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${l.status}`,"error"));let o=await l.json();o.success&&o.offers?(Q=o.currentPage||e,Y=o.totalPages||1,Z=o.totalItems||o.offers.length,t=o.offers,(u=document.querySelector("#requests-tab .card-body"))?(u.innerHTML=`
    <div class="offers-table-container">
        <div class="data-table offers-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{437}\u{430}\u{44F}\u{432}\u{43E}\u{43A}</h3>
                <div class="table-header-actions d-flex align-items-center" style="gap: 1rem;">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-funnel"></i></span>
                        <select class="form-select form-select-sm" id="statusFilter">
                            <option value="all" ${"all"===ee?"selected":""}>\u{412}\u{441}\u{435} \u{441}\u{442}\u{430}\u{442}\u{443}\u{441}\u{44B}</option>
                            <option value="PENDING" ${"PENDING"===ee?"selected":""}>\u{41D}\u{430} \u{440}\u{430}\u{441}\u{441}\u{43C}\u{43E}\u{442}\u{440}\u{435}\u{43D}\u{438}\u{438}</option>
                            <option value="APPROVED" ${"APPROVED"===ee?"selected":""}>\u{41E}\u{434}\u{43E}\u{431}\u{440}\u{435}\u{43D}\u{44B}\u{435}</option>
                            <option value="COMPLETED" ${"COMPLETED"===ee?"selected":""}>\u{412}\u{44B}\u{43F}\u{43E}\u{43B}\u{43D}\u{435}\u{43D}\u{44B}\u{435}</option>
                            <option value="REJECTED" ${"REJECTED"===ee?"selected":""}>\u{41E}\u{442}\u{43A}\u{43B}\u{43E}\u{43D}\u{435}\u{43D}\u{43D}\u{44B}\u{435}</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">\u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{44B}\u{432}\u{430}\u{442}\u{44C}</span>
                        <select class="form-select form-select-sm" id="pageSizeSelect">
                            <option value="5" ${5===et?"selected":""}>5</option>
                            <option value="10" ${10===et?"selected":""}>10</option>
                            <option value="20" ${20===et?"selected":""}>20</option>
                            <option value="50" ${50===et?"selected":""}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="table-content" id="offersTableContent">
                <!-- Table Header -->
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{41F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{44C}</div>
                    <div class="table-cell">\u{422}\u{435}\u{43C}\u{430}</div>
                    <div class="table-cell">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41E}\u{442}\u{432}\u{435}\u{442}</div>
                    <div class="table-cell">\u{421}\u{442}\u{430}\u{442}\u{443}\u{441}</div>
                    <div class="table-cell">\u{421}\u{43E}\u{437}\u{434}\u{430}\u{43D}\u{430}</div>
                    <div class="table-cell">\u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}\u{430}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>

                <!-- Offer Rows -->
                ${t.length>0?t.map(e=>`
                <div class="table-row">
                    <div class="table-cell text-muted">#${e.id||"N/A"}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${e.fio||"N/A"}</div>
                    </div>
                    <div class="table-cell">
                        <div class="fw-bold">${e.topic||"N/A"}</div>
                    </div>
                    <div class="table-cell">
                        <span class="course-description">${e.description||"N/A"}</span>
                    </div>
                    <div class="table-cell">
                        <span class="course-description">${e.response||"Нет ответа"}</span>
                    </div>
                    <div class="table-cell">${function(e){switch(e){case"PENDING":return'<span class="status-badge status-pending">Не рассмотрена</span>';case"REJECTED":return'<span class="status-badge status-rejected">Отклонена</span>';case"APPROVED":return'<span class="status-badge status-review">Одобрена</span>';case"COMPLETED":return'<span class="status-badge status-completed">Выполнена</span>';default:return`<span class="status-badge">${e||"N/A"}</span>`}}(e.status)}</div>
                    <div class="table-cell text-sm text-muted">${ea(e.createdAt)}</div>
                    <div class="table-cell text-sm text-muted">${ea(e.updatedAt)}</div>
                    <div class="table-cell action-buttons justify-content-center">
                        ${createOfferResponseButton(e)}
                        <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" data-action="delete-offer" data-offer-id="${e.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join(""):`
                <div class="table-row" style="grid-template-columns: 1fr;">
                    <div class="text-center py-4 text-muted">
                        <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                        \u{417}\u{430}\u{44F}\u{432}\u{43A}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}
                    </div>
                </div>
                `}
            </div>
        </div>
    </div>`,(n=document.getElementById("statusFilter"))&&n.addEventListener("change",e=>{ee=e.target.value,eu(1)}),(a=document.getElementById("pageSizeSelect"))&&a.addEventListener("change",e=>{et=parseInt(e.target.value,10),eu(1)}),(s=document.getElementById("offersTableContent"))&&s.addEventListener("click",e=>{let t=e.target.closest('button[data-action="delete-offer"]');t&&en(t.dataset.offerId)})):console.error("Контейнер для таблицы заявок не найден"),function(){let e,t=document.querySelector(".pagination-container-edit-offers");if(!t){let e=document.querySelector("#requests-tab .card-body");if(!e)return console.error("Основной контейнер для таблицы заявок не найден, пагинация не будет отображена.");{let u=document.createElement("div");u.className="pagination-container-edit-offers mt-3",e.appendChild(u),t=u}}if(Y<=1){t.innerHTML="";return}let u=`
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <!-- Previous Button -->
                <li class="page-item ${1===Q?"disabled":""}">
                    <a class="page-link" href="#" data-action="change-page" data-page-number="${Q-1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`,n=Math.max(1,Q-Math.floor(2.5)),a=Math.min(Y,n+5-1);a-n+1<5&&(n=Math.max(1,a-5+1)),n>1&&(u+='<li class="page-item"><a class="page-link" href="#" data-action="change-page" data-page-number="1">1</a></li>',n>2&&(u+='<li class="page-item disabled"><span class="page-link">...</span></li>'));for(let e=n;e<=a;e++)u+=`
            <li class="page-item ${e===Q?"active":""}">
                <a class="page-link" href="#" data-action="change-page" data-page-number="${e}">${e}</a>
            </li>`;a<Y&&(a<Y-1&&(u+='<li class="page-item disabled"><span class="page-link">...</span></li>'),u+=`<li class="page-item"><a class="page-link" href="#" data-action="change-page" data-page-number="${Y}">${Y}</a></li>`),u+=`
                <!-- Next Button -->
                <li class="page-item ${Q===Y?"disabled":""}">
                    <a class="page-link" href="#" data-action="change-page" data-page-number="${Q+1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">\u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${Q} \u{438}\u{437} ${Y} \u{2022} \u{412}\u{441}\u{435}\u{433}\u{43E} \u{437}\u{430}\u{44F}\u{432}\u{43E}\u{43A}: ${Z}</small>
        </div>`,t.innerHTML=u,(e=document.querySelector(".pagination-container-edit-offers"))&&e.addEventListener("click",e=>{e.preventDefault();let t=e.target.closest('a[data-action="change-page"]');if(t){var u;let e=parseInt(t.dataset.pageNumber,10);isNaN(e)||(u=e)<1||u>Y||u===Q||eu(u)}})}()):(console.error(Error("Неверный формат данных от AdminOfferController")),showAlert("Неверный формат данных от AdminOfferController","error"))}catch(t){console.error("Ошибка при загрузке заявок:",t);let e=document.querySelector("#requests-tab .card-body");e&&(e.innerHTML=`<div class="text-center py-4 text-danger">\u{41D}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{43E}\u{441}\u{44C} \u{437}\u{430}\u{433}\u{440}\u{443}\u{437}\u{438}\u{442}\u{44C} \u{437}\u{430}\u{44F}\u{432}\u{43A}\u{438}.</div>`)}}async function en(e){if(confirm("Вы уверены, что хотите удалить эту заявку?"))try{let t="function"==typeof getCsrfToken?getCsrfToken():document.querySelector('meta[name="_csrf"]')?.getAttribute("content")||"",u=await fetch(`/admin/offers/delete/${e}`,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":t}}),n=await u.json();u.ok&&n.success?(showAlert("Заявка успешно удалена!","success"),eu(Q)):showAlert(n.error||"Ошибка при удалении заявки","error")}catch(e){console.error("Ошибка удаления заявки:",e),showAlert("Ошибка сервера","error")}}function ea(e){if(!e)return"N/A";try{return new Date(e).toISOString().split("T")[0]}catch(t){return e}}function es(e){let t=e.target.closest(".js-open-response-modal");t&&eo({id:t.dataset.id,description:t.dataset.description,response:t.dataset.response,status:t.dataset.status})}async function el(e){e.preventDefault();let t=e.target,u={offerId:t.querySelector("#offerId").value,status:t.querySelector("#responseStatus").value,response:t.querySelector("#responseText").value.trim()},n=t.querySelector('button[type="submit"]'),a=n.innerHTML;try{n.disabled=!0,n.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Обновление...';let e=await fetch("/admin/updateOffer",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="_csrf"]')?.getAttribute("content")||""},body:JSON.stringify(u)}),t=await e.json();if(!e.ok){let e=t.errors?"Ошибки валидации:\n"+Object.values(t.errors).join("\n"):`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${t.message||"Неизвестная ошибка"}`;showAlert(e,"error");return}showAlert("Заявка успешно обновлена!","success"),bootstrap.Modal.getInstance(document.getElementById("offerResponseModal")).hide(),"function"==typeof loadOffers&&loadOffers()}catch(e){console.error("Error updating offer:",e),showAlert("Ошибка сервера","error")}finally{n.disabled=!1,n.innerHTML=a}}function eo(e){var t;t=e,document.getElementById("responseOfferId").textContent=t.id,document.getElementById("offerId").value=t.id,document.getElementById("responseDescription").textContent=t.description||"Описание отсутствует",document.getElementById("responseStatus").value=t.status||"PENDING",document.getElementById("responseText").value=t.response||"",new bootstrap.Modal(document.getElementById("offerResponseModal")).show()}function ei(){let e=document.getElementById("adminUpdateForm");e&&e.reset(),document.getElementById("responseOfferId").textContent="",document.getElementById("responseDescription").textContent="Описание отсутствует"}function er(e){if("string"!=typeof e)return"";let t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return e.replace(/[&<>"]|'(?!$)/g,e=>t[e])}document.addEventListener("DOMContentLoaded",function(){document.getElementById("requests-tab")&&eu(1)}),window.loadOffers=eu,document.addEventListener("DOMContentLoaded",function(){let e=document.getElementById("offerResponseModal"),t=document.getElementById("adminUpdateForm");e&&(document.body.addEventListener("click",es),e.addEventListener("hidden.bs.modal",ei)),t&&t.addEventListener("submit",el)}),window.openOfferResponseModal=eo,window.createOfferResponseButton=function(e){return`
        <button class="btn btn-info btn-icon btn-sm js-open-response-modal"
                title="\u{41E}\u{442}\u{432}\u{435}\u{442}\u{438}\u{442}\u{44C}"
                data-id="${e.id}"
                data-description="${er(e.description||"")}"
                data-response="${er(e.response||"")}"
                data-status="${e.status}">
            <i class="bi bi-reply"></i>
        </button>
    `};let ed=null;async function ec(e){try{let t=await fetch(`/admin/user/${e}`);if(!t.ok)throw Error("Ошибка загрузки данных пользователя");let u=await t.json();if(!u.success)throw Error(u.message||"Ошибка данных пользователя");ed=u.data,console.log(ed);let n=document.getElementById("editUserModal");if(!n)throw Error("Модальное окно не найдено в DOM");let a=new bootstrap.Modal(n);$("#editUserName").text(`${ed.firstName} ${ed.lastName}`),$("#editUserUsername").text(`${ed.username}`),$("#editUserDepartment").val(`${ed.department}`),$("#editUserJobTitle").val(`${ed.jobTitle}`),$("#editUserQualification").val(`${ed.qualification}`),$("#userIdForUpdate").val(`${ed.id}`),a.show()}catch(e){console.error("Ошибка открытия модального окна:",e),showAlert("Не удалось открыть форму редактирования","error")}}async function em(){try{let e={userId:document.getElementById("userIdForUpdate").value,department:document.getElementById("editUserDepartment").value,jobTitle:document.getElementById("editUserJobTitle").value,qualification:document.getElementById("editUserQualification").value,role:document.getElementById("editUserRole").value};console.log(e);let t=await fetch("/admin/user/update",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="_csrf"]')?.getAttribute("content")||""},body:JSON.stringify(e)}),u=await t.json();console.log(u),t.ok&&u.success?(showAlert("Данные успешно обновлены!","success"),bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide(),loadUsers()):u.errors?function(e){let t=[];for(let[n,a]of Object.entries(e)){var u;t.push(`${{userId:"ID пользователя",department:"Отдел",jobTitle:"Должность",qualification:"Квалификация",role:"Роль"}[u=n]||u}: ${a}`)}t.length>0&&showAlert("Ошибки валидации:\n"+t.join("\n"),"error")}(u.errors):showAlert(u.error||"Ошибка при сохранении данных","error")}catch(e){console.error("Ошибка сохранения:",e),showAlert("Произошла ошибка при сохранении данных","error")}}document.addEventListener("DOMContentLoaded",function(){document.getElementById("saveUserChangesBtn").addEventListener("click",em)}),window.editUser=function(e){ec(e)};let ep=1,eg=1,ef=0,eb=10,ev="ALL";async function eh(e=1,t=eb,u=ev){console.log("Refresh button clicked. Calling loadUsers.");try{console.log(`\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{435}\u{439}: \u{441}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${e}, \u{440}\u{430}\u{437}\u{43C}\u{435}\u{440} ${t}, \u{440}\u{43E}\u{43B}\u{44C} ${u}`);let n=await fetch(`/admin/users?page=${e}&size=${t}&role=${u}`);if(n.ok){let t=await n.json();if(t.success&&t.data)ep=t.data.currentPage||e,eg=t.data.totalPages||1,ef=t.data.totalItems||t.data.content.length,function(e){let t=document.querySelector("#users-tab .card-body");if(!t)return console.error("Контейнер для таблицы не найден");t.innerHTML="",t.innerHTML=`
    <div class="users-table-container">
        <div class="data-table users-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{435}\u{439}</h3>
                <div class="table-header-actions d-flex align-items-center" style="gap: 1rem;">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-people"></i></span>
                        <select class="form-select form-select-sm" id="roleFilter" onchange="filterByUserRole(this.value)">
                            <option value="ALL" ${"ALL"===ev?"selected":""}>\u{412}\u{441}\u{435} \u{440}\u{43E}\u{43B}\u{438}</option>
                            <option value="USER" ${"USER"===ev?"selected":""}>\u{41F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{44C}</option>
                            <option value="ADMIN" ${"ADMIN"===ev?"selected":""}>\u{410}\u{434}\u{43C}\u{438}\u{43D}\u{438}\u{441}\u{442}\u{440}\u{430}\u{442}\u{43E}\u{440}</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">\u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{44B}\u{432}\u{430}\u{442}\u{44C}</span>
                        <select class="form-select form-select-sm" id="pageSizeSelect" onchange="rowsInUserTable(this.value)">
                            <option value="5" ${5==eb?"selected":""}>5</option>
                            <option value="10" ${10==eb?"selected":""}>10</option>
                            <option value="20" ${20==eb?"selected":""}>20</option>
                            <option value="50" ${50==eb?"selected":""}>50</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="table-content">
                <!-- \u{417}\u{430}\u{433}\u{43E}\u{43B}\u{43E}\u{432}\u{43E}\u{43A} \u{442}\u{430}\u{431}\u{43B}\u{438}\u{446}\u{44B} -->
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{410}\u{432}\u{430}\u{442}\u{430}\u{440}</div>
                    <div class="table-cell">\u{418}\u{43C}\u{44F}</div>
                    <div class="table-cell">\u{424}\u{430}\u{43C}\u{438}\u{43B}\u{438}\u{44F}</div>
                    <div class="table-cell">\u{41E}\u{442}\u{434}\u{435}\u{43B}</div>
                    <div class="table-cell">\u{414}\u{43E}\u{43B}\u{436}\u{43D}\u{43E}\u{441}\u{442}\u{44C}</div>
                    <div class="table-cell">\u{41A}\u{432}\u{430}\u{43B}\u{438}\u{444}\u{438}\u{43A}\u{430}\u{446}\u{438}\u{44F}</div>
                    <div class="table-cell">\u{41B}\u{43E}\u{433}\u{438}\u{43D}</div>
                    <div class="table-cell">\u{421}\u{43E}\u{437}\u{434}\u{430}\u{43D}</div>
                    <div class="table-cell">\u{420}\u{43E}\u{43B}\u{44C}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>
                
                ${e.length>0?e.map(e=>{var t;return`
                    <div class="table-row">
                        <div class="table-cell text-muted">#${e.id||"N/A"}</div>
                        <div class="table-cell">
                            <img src="/avatars/${e.avatar||"avatar.png"}" alt="\u{410}\u{432}\u{430}\u{442}\u{430}\u{440}" class="user-avatar">
                        </div>
                        <div class="table-cell">${ey(e.firstName||"Не указано")}</div>
                        <div class="table-cell">${ey(e.lastName||"Не указано")}</div>
                        <div class="table-cell">${ey(e.department||"Не указан")}</div>
                        <div class="table-cell">${ey(e.jobTitle||"Не указана")}</div>
                        <div class="table-cell">
                            <span class="status-badge ${function(e){if(!e)return"status-pending";let t=e.toLowerCase();return t.includes("expert")||t.includes("senior")||t.includes("lead")?"status-completed":t.includes("middle")||t.includes("intermediate")?"status-review":t.includes("junior")||t.includes("trainee")?"status-pending":"status-pending"}(e.qualification)}">
                                ${ey(e.qualification||"Не указана")}
                            </span>
                        </div>
                        <div class="table-cell">${ey(e.username||"Не указан")}</div>
                        <div class="table-cell text-sm text-muted">${function(e){if(!e)return"Не указано";try{return new Date(e).toLocaleDateString("ru-RU",{year:"numeric",month:"2-digit",day:"2-digit"})}catch(t){return e}}(e.createdAt)}</div>
                        <div class="table-cell">${t=e.role,"[ROLE_USER]"===t?"Пользователь":"Администратор"}</div>
                        <div class="table-cell action-buttons justify-content-center">
                            <button class="btn btn-primary btn-icon btn-sm" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" onclick="editUser(${e.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" onclick="deleteUser(${e.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button class="btn btn-success btn-icon btn-sm" title="\u{417}\u{430}\u{43F}\u{438}\u{441}\u{430}\u{442}\u{44C} \u{43D}\u{430} \u{43A}\u{443}\u{440}\u{441}" onclick="openEnrollModal(${e.id}, '${ey(e.firstName)} ${ey(e.lastName)}')">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                            <button class="btn btn-info btn-icon btn-sm" title="\u{41F}\u{440}\u{43E}\u{441}\u{43C}\u{43E}\u{442}\u{440} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432}" onclick="openViewCoursesModal(${e.id}, '${ey(e.firstName)} ${ey(e.lastName)}')">
                                <i class="bi bi-card-list"></i>
                            </button>
                        </div>
                    </div>
                `}).join(""):`
                    <div class="table-row" style="grid-template-columns: 1fr;">
                        <div class="text-center py-4 text-muted">
                            <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                            \u{41F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}
                        </div>
                    </div>
                `}
            </div>
        </div>
    </div>
        
    <!-- \u{41A}\u{43E}\u{43D}\u{442}\u{435}\u{439}\u{43D}\u{435}\u{440} \u{434}\u{43B}\u{44F} \u{43F}\u{430}\u{433}\u{438}\u{43D}\u{430}\u{446}\u{438}\u{438} -->
    <div class="pagination-container mt-3"></div>
    
    <!-- \u{41A}\u{43D}\u{43E}\u{43F}\u{43A}\u{430} \u{43E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{44F} -->
    <div class="text-center mt-3">
        <button class="btn btn-primary" onclick="refreshUsersTable()">
            <i class="bi bi-arrow-repeat"></i> \u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{44C} \u{441}\u{43F}\u{438}\u{441}\u{43E}\u{43A}
        </button>
    </div>
    `;let u=document.querySelector("#users-tab .pagination-container");if(!u)return console.error("Контейнер для пагинации не найден");if(eg<=1){u.innerHTML="";return}let n=`
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${1===ep?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeUsersPage(${ep-1}); return false;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `,a=Math.max(1,ep-Math.floor(2.5)),s=Math.min(eg,a+5-1);s-a+1<5&&(a=Math.max(1,s-5+1)),a>1&&(n+=`
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeUsersPage(1); return false;">1</a>
            </li>
            ${a>2?'<li class="page-item disabled"><span class="page-link">...</span></li>':""}
        `);for(let e=a;e<=s;e++)n+=`
            <li class="page-item ${e===ep?"active":""}">
                <a class="page-link" href="#" onclick="changeUsersPage(${e}); return false;">${e}</a>
            </li>
        `;s<eg&&(n+=`
            ${s<eg-1?'<li class="page-item disabled"><span class="page-link">...</span></li>':""}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeUsersPage(${eg}); return false;">${eg}</a>
            </li>
        `),u.innerHTML=n+`
                <li class="page-item ${ep===eg?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeUsersPage(${ep+1}); return false;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                \u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${ep} \u{438}\u{437} ${eg} \u{2022} 
                \u{412}\u{441}\u{435}\u{433}\u{43E} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{435}\u{439}: ${ef}
            </small>
        </div>
    `}(t.data.content);else throw Error("Неверный формат данных от сервера")}else throw Error(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${n.status}`)}catch(t){var n;let e;console.error("Ошибка загрузки пользователей:",t),n="Не удалось загрузить данные пользователей",(e=document.querySelector("#users-tab .card-body"))&&(e.innerHTML=`
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                ${ey(n)}
            </div>
            <div style="text-align: center; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="loadUsers(1)">
                    <i class="fas fa-redo"></i> \u{41F}\u{43E}\u{43F}\u{440}\u{43E}\u{431}\u{43E}\u{432}\u{430}\u{442}\u{44C} \u{441}\u{43D}\u{43E}\u{432}\u{430}
                </button>
            </div>
        `)}}async function eE(e){try{let t=JSON.stringify({userId:e}),u=await fetch("/admin/users/delete",{method:"POST",headers:{"Content-Type":"application/json"},body:t}),n=await u.json();if(console.log(n),u.ok)if(n.success){let e=n.message||n.data;showAlert(e,"success"),await eh(ep,eb,ev)}else showAlert(n.message,"error");else showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${n.error||"Неизвестная ошибка"}`,"error")}catch(e){showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${e.message}`,"error"),console.error("Delete error:",e)}}function ey(e){if(null==e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}async function ew(e,t){document.getElementById("enrollUserName").textContent=t,document.getElementById("enrollUserId").value=e;let u=document.getElementById("courseSelect");u.innerHTML="<option>Загрузка курсов...</option>",new bootstrap.Modal(document.getElementById("enrollUserModal")).show();try{let e=await fetch("/admin/courses"),t=await e.json();console.log(t),t.success&&t.data&&t.data.content&&(u.innerHTML="",0===t.data.content.length?u.innerHTML="<option>Нет доступных курсов</option>":t.data.content.forEach(e=>{let t=document.createElement("option");t.value=e.id,t.textContent=e.title,u.appendChild(t)}))}catch(e){u.innerHTML="<option>Ошибка загрузки курсов</option>",console.error(e)}}async function eC(){let e=document.getElementById("enrollUserId").value,t=document.getElementById("courseSelect").value;if(!t||isNaN(t))return void alert("Пожалуйста, выберите курс.");let u={userId:parseInt(e),courseId:parseInt(t)};console.log("enrollment data ",u);try{let e=await fetch("/admin/user/enroll",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)}),t=await e.json();e.ok&&t.success?(showAlert(t.message),bootstrap.Modal.getInstance(document.getElementById("enrollUserModal")).hide()):showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${t.message||"Не удалось записать пользователя."}`,"error")}catch(e){showAlert("Ошибка сервера","error"),console.error(e)}}async function e$(e,t){document.getElementById("viewUserName").textContent=t;let u=document.getElementById("userCoursesList");u.innerHTML='<li class="list-group-item">Загрузка курсов...</li>',u.dataset.userId=e,u.dataset.userName=t,new bootstrap.Modal(document.getElementById("viewUserCoursesModal")).show(),await eI(e,t)}async function eI(e,t){let u=document.getElementById("userCoursesList");u.innerHTML='<li class="list-group-item">Загрузка курсов...</li>';try{let n=await fetch(`/admin/user/${e}/courses`),a=await n.json();a.success&&a.data?(u.innerHTML="",0===a.data.length?u.innerHTML='<li class="list-group-item">Пользователь не записан ни на один курс.</li>':a.data.forEach(n=>{let a=document.createElement("li");a.className="list-group-item d-flex justify-content-between align-items-center";let s=document.createElement("span");s.textContent=n.title,a.appendChild(s);let l=document.createElement("button");l.className="btn btn-danger btn-sm",l.textContent="Отписать",l.onclick=()=>eB(e,t,n.id,n.title),a.appendChild(l),u.append(a)})):(u.innerHTML='<li class="list-group-item text-danger">Ошибка загрузки курсов.</li>',console.error("Failed to load user courses:",a.error))}catch(e){u.innerHTML='<li class="list-group-item text-danger">Ошибка сервера.</li>',console.error("Network error loading user courses:",e)}}function eB(e,t,u,n){confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{43E}\u{442}\u{43F}\u{438}\u{441}\u{430}\u{442}\u{44C} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{44F} "${t}" \u{43E}\u{442} \u{43A}\u{443}\u{440}\u{441}\u{430} "${n}"?`)&&eA(e,u,t)}async function eA(e,t,u){try{let n=await fetch("/admin/user/unenroll",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e,courseId:t})}),a=await n.json();n.ok&&a.success?(alert(a.message),await eI(e,u)):showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${a.message||"Не удалось отписать пользователя."}`,"error")}catch(e){showAlert("Ошибка сервера","error"),console.error(e)}}document.addEventListener("DOMContentLoaded",function(){document.getElementById("users-tab")&&eh(1,eb,ev)}),window.loadUsers=eh,window.deleteUser=function(e){confirm("Вы уверены, что хотите удалить этого пользователя?")&&eE(e)},window.openEnrollModal=ew,window.confirmEnrollment=eC,window.openViewCoursesModal=e$,window.confirmUnenrollment=eB,window.unenrollRequest=eA,window.changeUsersPage=function(e){e<1||e>eg||e===ep||eh(e,eb,ev)},window.currentPageUsers=ep,window.rowsInUserTable=function(e){eh(1,eb=parseInt(e,10),ev)},window.filterByUserRole=function(e){eh(1,eb,ev=e)},window.refreshUsersTable=function(){eh(ep,eb,ev)};let eM=1,ex=1,eL=0,eD=5;async function ek(){try{let e=await fetch("/admin/documents/courses");if(!e.ok)return null;let t=await e.json();if(console.log(t),!t.success||!t.data)return null;{let e=document.getElementById("courseFilterSelect");if(!e)return;let u=e.value;e.innerHTML='<option value="">Все курсы</option>',t.data.forEach(t=>{let u=document.createElement("option");u.value=t.id,u.textContent=t.title,e.appendChild(u)}),u&&(e.value=u)}}catch(e){showAlert("Не удалось загрузить фильтр курсов.","warning")}}async function eT(){try{let e=await fetch("/admin/documents/categories");if(!e.ok)return null;let t=await e.json();if(console.log(t),!t.success||!t.data)return null;{let e=document.getElementById("categoryFilterSelect");if(!e)return;let u=e.value;e.innerHTML='<option value="">Все категории</option>',t.data.forEach(t=>{let u=document.createElement("option");u.value=t.id,u.textContent=t.name,e.appendChild(u)}),u&&(e.value=u)}}catch(e){showAlert("Не удалось загрузить фильтр категорий.","warning")}}async function eS(e=1){console.log("loadDocuments called. Current docsPerPage:",eD);try{eP(!0);let t=document.getElementById("courseFilterSelect")?.value||"",u=document.getElementById("categoryFilterSelect")?.value||"",n=`/admin/documents?page=${e}&size=${eD}`;t&&(n+=`&courseId=${t}`,console.log("Filtering by Course ID:",t)),u&&(n+=`&categoryId=${u}`,console.log("Filtering by Category ID:",u)),console.log("Fetching documents from URL:",n);let a=await fetch(n);if(a.ok){let t=await a.json();if(console.log("Documents API Response:",t),t.success&&t.data){let u=t.data;console.log("Paginated Data Content:",u.content),eM=u.currentPage||e,ex=u.totalPages||1,eL=u.totalItems||0,eF(u.content),ej(u.content)}else showAlert(t.message||"Неверный формат данных","error")}else{if(404!==a.status)return null;eF([]),ej([])}}catch(e){showAlert(e.message,"error")}finally{eP(!1)}}function eF(e){let t=document.getElementById("documentsContainer");if(!t)return;t.innerHTML="";let u=document.createElement("div");u.className="documents-table-container",u.innerHTML=`
        <div class="data-table documents-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{434}\u{43E}\u{43A}\u{443}\u{43C}\u{435}\u{43D}\u{442}\u{43E}\u{432}</h3>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41A}\u{443}\u{440}\u{441}</div>
                    <div class="table-cell">\u{41A}\u{430}\u{442}\u{435}\u{433}\u{43E}\u{440}\u{438}\u{44F}</div>
                    <div class="table-cell">\u{422}\u{435}\u{433}\u{438}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>

                ${e.length>0?e.map(e=>{var t;return`
                <div class="table-row">
                    <div class="table-cell text-muted">#${e.id||"N/A"}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${eq(e.name||"Без названия")}</div>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${eq(e.courseName||"N/A")}</span>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${eq(e.categoryName||"N/A")}</span>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${t=e.tags||"Нет тегов",!t||t.length<=50?eq(t||""):eq(t.substring(0,50))+"..."}</span>
                    </div>
                    <div class="table-cell action-buttons">
                        ${e.file?`<a href="/docs/${e.file}" class="btn btn-success btn-icon btn-sm" title="\u{41E}\u{442}\u{43A}\u{440}\u{44B}\u{442}\u{44C} \u{444}\u{430}\u{439}\u{43B}" target="_blank"><i class="bi bi-eye"></i></a>`:""}
                        <button class="btn btn-info btn-icon btn-sm edit-doc-btn" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" data-doc-id="${e.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}"
                                onclick="deleteDocument(${e.id}, '${eq(e.name)}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `}).join(""):`
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="bi bi-file-earmark-text me-2"></i>
                        \u{414}\u{43E}\u{43A}\u{443}\u{43C}\u{435}\u{43D}\u{442}\u{44B} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}. \u{418}\u{437}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{435} \u{444}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{438}\u{43B}\u{438} \u{434}\u{43E}\u{431}\u{430}\u{432}\u{44C}\u{442}\u{435} \u{43D}\u{43E}\u{432}\u{44B}\u{439} \u{434}\u{43E}\u{43A}\u{443}\u{43C}\u{435}\u{43D}\u{442}.
                    </div>
                </div>
                `}
            </div>
        </div>
    `,t.appendChild(u)}function ej(e){console.log("Rendering documents pagination with:",e);let t=document.getElementById("documentsPagination");if(!t)return;if(ex<=1){t.innerHTML="";return}let u=`
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${1===eM?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeDocsPage(${eM-1}); return false;">&laquo;</a>
                </li>
    `,n=Math.max(1,eM-Math.floor(2.5)),a=Math.min(ex,n+5-1);a-n+1<5&&(n=Math.max(1,a-5+1)),n>1&&(u+='<li class="page-item"><a class="page-link" href="#" onclick="changeDocsPage(1); return false;">1</a></li>',n>2&&(u+='<li class="page-item disabled"><span class="page-link">...</span></li>'));for(let e=n;e<=a;e++)u+=`<li class="page-item ${e===eM?"active":""}"><a class="page-link" href="#" onclick="changeDocsPage(${e}); return false;">${e}</a></li>`;a<ex&&(a<ex-1&&(u+='<li class="page-item disabled"><span class="page-link">...</span></li>'),u+=`<li class="page-item"><a class="page-link" href="#" onclick="changeDocsPage(${ex}); return false;">${ex}</a></li>`),t.innerHTML=u+`
                <li class="page-item ${eM===ex?"disabled":""}">
                    <a class="page-link" href="#" onclick="changeDocsPage(${eM+1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                \u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${eM} \u{438}\u{437} ${ex} \u{2022} \u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{430}\u{43D}\u{43E} ${e.length} \u{438}\u{437} ${eL} \u{434}\u{43E}\u{43A}\u{443}\u{43C}\u{435}\u{43D}\u{442}\u{43E}\u{432}
            </small>
        </div>
    `}function eP(e){let t=document.getElementById("documentsContainer");t&&e&&(t.innerHTML=`
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430}...</span>
                </div>
            </div>
        `)}function eq(e){if("string"!=typeof e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}async function eN(e,t){if(confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C} \u{434}\u{43E}\u{43A}\u{443}\u{43C}\u{435}\u{43D}\u{442} "${t}"?`))try{let u=await fetch(`/admin/documents/${e}/delete`,{method:"DELETE",headers:{"Content-Type":"application/json"}}),n=await u.json().catch(()=>({}));if(u.ok&&n.success)showAlert(`\u{414}\u{43E}\u{43A}\u{443}\u{43C}\u{435}\u{43D}\u{442} "${t}" \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}.`,"success"),eS(eM||1);else{let e=n.message||`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${u.status}`;showAlert(e,"error")}}catch(e){showAlert(e.message,"error")}}async function eH(){let e=document.getElementById("createDocumentModal");if(!e)return void console.error("Create document modal not found");let t=new bootstrap.Modal(e);document.getElementById("createDocumentForm").reset(),document.getElementById("docTagsContainer").innerHTML="Загрузка тегов...",document.getElementById("docTagsSelect").innerHTML="",document.getElementById("docCategory").innerHTML='<option value="">Сначала выберите курс</option>',document.getElementById("docCategory").disabled=!0,await eO(),await eR(),t.show()}async function eO(){let e=document.getElementById("docCourse");try{let t=await fetch("/admin/documents/courses"),u=await t.json();u.success&&u.data?(e.innerHTML='<option value="" disabled selected>Выберите курс</option>',u.data.forEach(t=>{let u=document.createElement("option");u.value=t.id,u.textContent=t.title,e.appendChild(u)})):e.innerHTML='<option value="">Не удалось загрузить курсы</option>'}catch(t){e.innerHTML='<option value="">Ошибка загрузки</option>'}}async function eU(e){let t=document.getElementById("docCategory");if(!e){t.innerHTML='<option value="">Сначала выберите курс</option>',t.disabled=!0;return}t.innerHTML='<option value="">Загрузка категорий...</option>',t.disabled=!1;try{let u=await fetch(`/admin/documents/categories?courseId=${e}`),n=await u.json();n.success&&n.data&&n.data.length>0?(t.innerHTML='<option value="" disabled selected>Выберите категорию</option>',n.data.forEach(e=>{let u=document.createElement("option");u.value=e.id,u.textContent=e.name,t.appendChild(u)})):t.innerHTML='<option value="">Категории не найдены</option>'}catch(e){t.innerHTML='<option value="">Ошибка загрузки категорий</option>'}}async function eR(){let e=document.getElementById("docTagsContainer"),t=document.getElementById("docTagsSelect");if(e&&t)try{let u=await fetch("/api/tags"),n=await u.json();e.innerHTML="",n&&n.length>0?n.forEach(u=>{let n=document.createElement("span");n.className="badge rounded-pill text-bg-secondary p-2 m-1",n.textContent=u.name,n.style.cursor="pointer",n.dataset.tagName=u.name,n.addEventListener("click",()=>{n.classList.toggle("active"),n.classList.toggle("text-bg-primary"),n.classList.toggle("text-bg-secondary");let e=t.querySelector(`option[value="${u.name}"]`);if(n.classList.contains("active")){if(!e){let e=document.createElement("option");e.value=u.name,e.selected=!0,t.appendChild(e)}}else e&&e.remove()}),e.appendChild(n)}):e.textContent="Теги не найдены."}catch(t){e.textContent="Ошибка загрузки тегов."}}async function ez(e){e.preventDefault();let t=e.target,u=t.closest(".modal-content").querySelector('button[type="submit"]'),n=new FormData;n.append("name",t.querySelector("#docName").value),n.append("categoryId",t.querySelector("#docCategory").value),n.append("textContent",t.querySelector("#docTextContent").value);let a=t.querySelector("#docImageFile").files[0];a&&n.append("file",a),document.querySelectorAll("#docTagsSelect option:checked").forEach(e=>{n.append("tags",e.value)}),u.disabled=!0,u.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Создание...';try{let e=await fetch("/admin/documents/create",{method:"POST",body:n}),t=await e.json();if(e.ok&&t.success)showAlert("Документ успешно создан!","success"),bootstrap.Modal.getInstance(document.getElementById("createDocumentModal")).hide(),await eS(1);else if(400===e.status&&t.errors){let e=Object.values(t.errors).join(", ");showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{432}\u{430}\u{43B}\u{438}\u{434}\u{430}\u{446}\u{438}\u{438}: ${e}`,"error")}else showAlert(t.message||"Произошла ошибка при создании документа.","error")}catch(e){showAlert("Сетевая ошибка или ошибка сервера.","error")}finally{u.disabled=!1,u.innerHTML="Создать"}}document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector('a[data-tab="docs-tab"]');e&&(e.addEventListener("click",function(){setTimeout(()=>eS(1),10)}),document.getElementById("docs-tab")?.classList.contains("active")&&eS(1));let t=document.getElementById("createDocumentForm");t&&t.addEventListener("submit",ez),document.getElementById("docs-tab")?.classList.contains("active")&&(eS(1),ek(),eT())}),window.loadDocuments=eS,window.changeDocsPerPage=function(e){console.log("changeDocsPerPage called with:",e),console.log("docsPerPage set to:",eD=parseInt(e)||10),eS(1)},window.changeDocsPage=function(e){e<1||e>ex||e===eM||eS(e)},window.deleteDocument=eN,window.loadCoursesForFilter=ek,window.loadCategoriesForFilter=eT,window.openCreateDocumentModal=eH,window.handleCourseChangeForModal=eU;let eV=()=>Math.floor(Date.now()/1e3),eJ=((e={})=>{let t,{tokenName:u="jwt",refreshTokenName:n="refresh_token",autoRefreshInterval:a=36e5,expirationThreshold:s=300}=e,l=((e="TokenController")=>({info:(t,u)=>console.log(`[${e}] INFO: ${t}`,u||""),warn:(t,u)=>console.warn(`[${e}] WARN: ${t}`,u||""),error:(t,u)=>console.error(`[${e}] ERROR: ${t}`,u||""),debug:(t,u)=>console.debug(`[${e}] DEBUG: ${t}`,u||"")}))("TokenController"),o=e=>{let t=document.cookie.split(";").map(e=>e.trim()).find(t=>t.startsWith(`${e}=`));return t?decodeURIComponent(t.split("=")[1]):null},i=(e,t,u={})=>{let{days:n=7,path:a="/",secure:s=!0,sameSite:o="Strict"}=u,i=new Date;i.setTime(i.getTime()+864e5*n);let r=`expires=${i.toUTCString()}`,d=`path=${a}`,c=`SameSite=${o}`;document.cookie=`${e}=${encodeURIComponent(t)}; ${r}; ${d}; ${s?"Secure":""}; ${c}`,l.debug(`Cookie set: ${e}`,{expires:i.toISOString()})},r=e=>{if(!e||"string"!=typeof e)return l.warn("Invalid token provided for parsing"),null;try{let t=e.split(".");if(3!==t.length)throw Error("Invalid JWT format");let u=t[1].replace(/-/g,"+").replace(/_/g,"/"),n=atob(u),a=decodeURIComponent(Array.from(n).map(e=>"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)).join(""));return((e,t={})=>{try{return JSON.parse(e)}catch{return t}})(a)}catch(e){return l.error("JWT parsing failed",e),null}},d=()=>{let e=o(u);return l.debug("Token retrieved",{exists:!!e}),e},c=()=>{let e=o(n);return l.debug("Refresh token retrieved",{exists:!!e}),e},m=()=>{let e=d();if(!e)return l.warn("Token validation failed: no token"),!1;let t=r(e);if(!t||!t.exp)return l.warn("Token validation failed: invalid payload or expiration"),!1;let u=eV(),n=t.exp>u;return l.debug("Token validation check",{isValid:n,expiresIn:t.exp-u}),n},p=(e=s)=>{let t=d();if(!t)return l.warn("Token expiration check failed: no token"),!1;let u=r(t);if(!u||!u.exp)return!1;let n=eV(),a=u.exp-n,o=a<e;return l.debug("Token expiration check",{isExpiringSoon:o,expiresIn:a,threshold:e}),o},g=async()=>{let e=c();if(!e){let e=Error("No refresh token available");throw l.error("Token refresh failed",e),e}l.info("Attempting token refresh");try{let t=await fetch("/api/auth/refresh",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:e})});if(!t.ok){let e=Error(`Request failed with status ${t.status}`);throw e.response={status:t.status},e}let{accessToken:a,refreshToken:s}=await t.json();if(!a)throw Error("No access token in response");let o=[];return a&&(i(u,a),o.push("access token updated")),s&&(i(n,s),o.push("refresh token updated")),l.info("Token refresh successful",{actions:o}),a}catch(e){throw l.error("Token refresh API call failed",e),e.response?.status===401&&(l.warn("Clearing tokens due to authentication error"),i(u,"",{days:-1}),i(n,"",{days:-1})),e}},{start:f,stop:b}=(t=null,{start:()=>{t?l.warn("Auto-refresh already running"):(t=setInterval(()=>{let e=m(),t=p();e&&t&&(l.info("Auto-refresh triggered"),g().catch(e=>{l.error("Auto-refresh failed",e)}))},a),l.info("Auto-refresh started",{interval:a}))},stop:()=>{t&&(clearInterval(t),t=null,l.info("Auto-refresh stopped"))}});return{getToken:d,getRefreshToken:c,getStatus:()=>({hasToken:!!d(),hasRefreshToken:!!c(),isValid:m(),isExpiringSoon:p()}),isTokenValid:m,isTokenExpiringSoon:p,refreshToken:g,initialize:()=>{l.info("Initializing token controller"),f()},destroy:()=>{l.info("Destroying token controller"),b()},parseJwt:r}})();"loading"===document.readyState?document.addEventListener("DOMContentLoaded",eJ.initialize):eJ.initialize();let e_=window.fetch;window.fetch=function(...e){return e_.apply(this,e).then(e=>(401===e.status&&"/login"!==window.location.pathname&&(console.warn("Unauthorized (401) response detected. Redirecting to login page."),window.location.href="/login"),e)).catch(e=>{throw console.error("Fetch error:",e),e})}})();
//# sourceMappingURL=admin-bundle.js.map
