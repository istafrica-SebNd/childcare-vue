<template>
  <BaseLayout>
    <template #content>
      <div class="application-forms-page">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-content">
            <div class="header-title">
              <i class="pi pi-file text-2xl text-blue-600"></i>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Application Forms</h1>
                <p class="text-gray-600">Manage kindergarten application forms and templates</p>
              </div>
            </div>
            <button
              @click="showAddFormModal = true"
              class="add-form-btn"
            >
              <i class="pi pi-plus"></i>
              Add New Form
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="content-area">
          <!-- Section Title and Filter -->
          <div class="section-header">
            <h2 class="text-xl font-semibold text-gray-900">Application Forms (Ansökningsformulär)</h2>
            <div class="filter-section">
              <div class="district-filter">
                <i class="pi pi-map-marker text-gray-500"></i>
                <select v-model="selectedDistrict" class="district-select">
                  <option value="all">All Districts</option>
                  <option value="centrum">Centrum</option>
                  <option value="ostermalm">Östermalm</option>
                  <option value="sodermalm">Södermalm</option>
                  <option value="norrmalm">Norrmalm</option>
                </select>
                <i class="pi pi-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Application Forms Table -->
          <div class="forms-table-container">
            <table class="forms-table">
              <thead>
                <tr class="table-header">
                  <th class="name-header">Namn (internt)</th>
                  <th class="type-header">Verksamhetstyp</th>
                  <th class="templates-header">Templates</th>
                  <th class="change-header">Ändra</th>
                  <th class="questions-header">Frågaformulär</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="form in filteredForms"
                  :key="form.id"
                  class="table-row"
                >
                  <td class="name-cell">
                    <div class="form-name-content">
                      <a href="#" class="form-name-link" @click="openFormSummary(form)">{{ form.name }}</a>
                      <span
                        v-if="form.status === 'active'"
                        class="status-badge active"
                      >
                        Active
                      </span>
                      <span
                        v-else-if="form.status === 'draft'"
                        class="status-badge draft"
                      >
                        Draft
                      </span>
                      <div class="form-meta">
                        Last modified: {{ form.lastModified }} | {{ form.submissions }} submissions
                      </div>
                    </div>
                  </td>
                  <td class="type-cell">
                    {{ form.type }}
                  </td>
                  <td class="templates-cell">
                    <span
                      v-if="form.templateCount === form.totalTemplates"
                      class="template-count complete"
                    >
                      {{ form.templateCount }}/{{ form.totalTemplates }} Templates
                    </span>
                    <span
                      v-else
                      class="template-count incomplete"
                    >
                      {{ form.templateCount }}/{{ form.totalTemplates }} Templates
                    </span>
                  </td>
                  <td class="change-cell">
                    <button class="action-btn edit-btn" @click="editForm(form)">
                      <i class="pi pi-pencil"></i>
                    </button>
                  </td>
                  <td class="questions-cell">
                    <button class="action-btn questions-btn" @click="viewQuestions(form)">
                      <i class="pi pi-list"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add New Form Modal -->
        <div v-if="showAddFormModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">Add New Application Form</h2>
              <button @click="closeModal" class="modal-close">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="modal-body">
              <p class="modal-subtitle">Create a new kindergarten application form for a specific district</p>

              <form @submit.prevent="createForm" class="form-fields">
                <div class="field-group">
                  <label for="formName" class="field-label">
                    Form Name <span class="required">*</span>
                  </label>
                  <input
                    id="formName"
                    v-model="newForm.name"
                    type="text"
                    placeholder="e.g., Childcare Application"
                    class="field-input"
                    required
                  />
                </div>

                <div class="field-group">
                  <label for="formType" class="field-label">
                    Form Type <span class="required">*</span>
                  </label>
                  <div class="select-wrapper">
                    <select
                      id="formType"
                      v-model="newForm.type"
                      class="field-select"
                      required
                    >
                      <option value="">Select form type</option>
                      <option value="Förskola">Förskola</option>
                      <option value="Fritidshem">Fritidshem</option>
                      <option value="Familjedaghem">Familjedaghem</option>
                    </select>
                    <i class="pi pi-chevron-down select-arrow"></i>
                  </div>
                </div>

                <div class="field-group">
                  <label for="formDistrict" class="field-label">
                    District <span class="required">*</span>
                  </label>
                  <div class="select-wrapper">
                    <select
                      id="formDistrict"
                      v-model="newForm.district"
                      class="field-select"
                      required
                    >
                      <option value="">Select district</option>
                      <option value="centrum">Centrum</option>
                      <option value="ostermalm">Östermalm</option>
                      <option value="sodermalm">Södermalm</option>
                      <option value="norrmalm">Norrmalm</option>
                    </select>
                    <i class="pi pi-chevron-down select-arrow"></i>
                  </div>
                </div>

                <div class="modal-actions">
                  <button type="button" @click="closeModal" class="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" class="create-btn">
                    Create Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Configure Form Modal -->
        <div v-if="showConfigureModal" class="modal-overlay" @click="closeConfigureModal">
          <div class="modal-content large-modal" @click.stop>
            <div class="modal-header">
              <div class="modal-title-section">
                <h2 class="modal-title">Configure: {{ activeForm?.name }}</h2>
                <p class="modal-subtitle">Manage form settings, business rules, and application parameters</p>
              </div>
              <div class="modal-actions-header">
                <span class="status-badge active">Active</span>
                <button @click="closeConfigureModal" class="modal-close">
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>

            <div class="form-config-header">
              <h3 class="form-title">{{ activeForm?.name }}</h3>
              <p class="form-description">Configure form settings and templates</p>
            </div>

            <!-- Tab Navigation -->
            <div class="tab-navigation">
              <button
                :class="['tab-btn', { active: activeTab === 'templates' }]"
                @click="activeTab = 'templates'"
              >
                <i class="pi pi-file"></i>
                Templates
              </button>
              <button
                :class="['tab-btn', { active: activeTab === 'settings' }]"
                @click="activeTab = 'settings'"
              >
                <i class="pi pi-cog"></i>
                Settings
              </button>
              <button
                :class="['tab-btn', { active: activeTab === 'access' }]"
                @click="activeTab = 'access'"
              >
                <i class="pi pi-users"></i>
                Access
              </button>

            </div>

            <!-- Templates Tab -->
            <div v-if="activeTab === 'templates'" class="tab-content">
              <div class="template-management-header">
                <div>
                  <h4 class="section-title">Manage Templates</h4>
                  <p class="section-description">Build and customize your application form templates</p>
                </div>
                <button class="minimize-btn">
                  <i class="pi pi-times"></i>
                </button>
              </div>

              <div class="template-management">
                <div class="template-columns">
                  <!-- Not Selected Templates -->
                  <div class="template-column">
                    <div class="column-header">
                      <h5>Not selected templates</h5>
                      <button class="add-template-btn" @click="openTemplateEditor()">
                        <i class="pi pi-plus"></i>
                        Add new template
                      </button>
                    </div>

                    <div class="template-list">
                      <div
                        v-for="template in availableTemplates"
                        :key="template.id"
                        class="template-card"
                      >
                        <div class="template-header">
                          <div class="drag-handle">
                            <i class="pi pi-bars"></i>
                          </div>
                          <div class="template-info">
                            <h6 class="template-name">{{ template.name }}</h6>
                            <p class="template-description">{{ template.description }}</p>
                            <span class="input-count">{{ template.inputCount }} inputs</span>
                          </div>
                          <div class="template-actions">
                            <button class="template-action-btn expand">
                              <i class="pi pi-chevron-up"></i>
                            </button>
                            <button class="template-action-btn collapse">
                              <i class="pi pi-chevron-down"></i>
                            </button>
                            <button class="template-action-btn edit" @click="editTemplate(template)">
                              <i class="pi pi-pencil"></i>
                            </button>
                            <button
                              class="template-action-btn move"
                              @click="moveToSelected(template)"
                            >
                              <i class="pi pi-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Selected Templates -->
                  <div class="template-column">
                    <div class="column-header">
                      <h5>Selected templates</h5>
                    </div>

                    <div class="template-list">
                      <div
                        v-for="template in selectedTemplates"
                        :key="template.id"
                        class="template-card"
                      >
                        <div class="template-header">
                          <div class="drag-handle">
                            <i class="pi pi-bars"></i>
                          </div>
                          <div class="template-info">
                            <h6 class="template-name">{{ template.name }}</h6>
                            <p class="template-description">{{ template.description }}</p>
                            <span class="input-count">{{ template.inputCount }} inputs</span>
                          </div>
                          <div class="template-actions">
                            <button class="template-action-btn expand">
                              <i class="pi pi-chevron-up"></i>
                            </button>
                            <button class="template-action-btn collapse">
                              <i class="pi pi-chevron-down"></i>
                            </button>
                            <button class="template-action-btn edit" @click="editTemplate(template)">
                              <i class="pi pi-pencil"></i>
                            </button>
                            <button
                              class="template-action-btn move"
                              @click="moveToAvailable(template)"
                            >
                              <i class="pi pi-arrow-left"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="template-management-footer">
                  <button class="preview-btn" @click="openTemplatePreview()">
                    <i class="pi pi-eye"></i>
                    Preview Selected Templates
                  </button>
                  <div class="footer-actions">
                    <button class="cancel-btn" @click="closeConfigureModal">Cancel</button>
                    <button class="save-btn">Save Changes</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings Tab -->
            <div v-if="activeTab === 'settings'" class="tab-content">
              <div class="settings-content">
                <h4 class="section-title">Form Settings</h4>
                <p class="section-description">Configure form behavior and business rules</p>

                <div class="settings-form">
                  <div class="field-group">
                    <label class="field-label">Application Type</label>
                    <select class="field-select">
                      <option>Fritidshem Application</option>
                      <option>Förskola Application</option>
                      <option>Familjedaghem Application</option>
                    </select>
                  </div>

                  <div class="field-group">
                    <label class="field-label">Submission Rules</label>
                    <div class="checkbox-group">
                      <label class="checkbox-label">
                        <input type="checkbox" checked>
                        Allow multiple applications per child
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox">
                        Require manual approval
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Access Tab -->
            <div v-if="activeTab === 'access'" class="tab-content">
              <div class="access-content">
                <h4 class="section-title">Access Control</h4>
                <p class="section-description">Configure who can access and submit this form</p>

                <div class="access-settings">
                  <div class="field-group">
                    <label class="field-label">Who can submit applications</label>
                    <select class="field-select">
                      <option>All users</option>
                      <option>Registered guardians only</option>
                      <option>Specific user groups</option>
                    </select>
                  </div>

                  <div class="field-group">
                    <label class="field-label">Form visibility</label>
                    <div class="radio-group">
                      <label class="radio-label">
                        <input type="radio" name="visibility" value="public" checked>
                        Public - visible to all
                      </label>
                      <label class="radio-label">
                        <input type="radio" name="visibility" value="private">
                        Private - invitation only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        <!-- Template Preview Modal -->
        <div v-if="showTemplatePreviewModal && previewTemplate" class="modal-overlay" @click="closeTemplatePreview">
          <div class="modal-content preview-modal" @click.stop>
            <div class="modal-header">
              <div>
                <h2 class="modal-title">Template Preview: {{ previewTemplate.name }}</h2>
                <p class="modal-subtitle">Review all inputs and check for missing required fields</p>
              </div>
              <button @click="closeTemplatePreview" class="modal-close">
                <i class="pi pi-times"></i>
              </button>
            </div>
            <div class="preview-body">
              <div class="template-info-card">
                <div class="template-info-title">Template Information</div>
                <div class="template-info-desc">{{ previewTemplate.description }}</div>
                <div class="template-info-stats">
                  <span class="info-badge">{{ previewTemplate.fields.length }} inputs</span>
                  <span class="info-badge missing">2 missing</span> <!-- Replace with real logic if needed -->
                </div>
              </div>
              <div class="missing-required-box">
                <div class="missing-header">
                  <i class="pi pi-exclamation-circle"></i>
                  <span>Missing Required Input Types</span>
                </div>
                <div class="missing-badges">
                  <span class="missing-pill">Email Field</span>
                  <span class="missing-pill">Phone Number</span>
                </div>
              </div>
              <div class="configured-inputs-card">
                <div class="configured-header">
                  <i class="pi pi-check-circle"></i>
                  <span>Configured Inputs</span>
                </div>
                <div v-if="previewTemplate.fields.length > 0" class="configured-list">
                  <div v-for="field in previewTemplate.fields" :key="field.id" class="configured-item">
                    <div class="configured-icon">
                      <i v-if="field.type === 'text'" class="pi pi-font"></i>
                      <i v-else-if="field.type === 'date'" class="pi pi-calendar"></i>
                      <!-- Add more icons as needed -->
                    </div>
                    <div class="configured-details">
                      <div class="configured-label">{{ field.label }}</div>
                      <div class="configured-desc">{{ field.placeholder }}</div>
                    </div>
                    <div class="configured-meta">
                      <span v-if="field.required" class="meta-badge required">Required</span>
                      <span class="meta-badge type">{{ field.type === 'text' ? 'Open Text' : field.type === 'date' ? 'Date Picker' : field.type }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="configured-empty">No configured inputs</div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="close-btn" @click="closeTemplatePreview">Close Preview</button>
            </div>
          </div>
        </div>

        <!-- Form Settings Modal -->
        <div v-if="showFormSettingsModal" class="modal-overlay" @click="closeFormSettings">
          <div class="modal-content large-modal settings-modal" @click.stop>
            <div class="modal-header">
              <div class="modal-title-section">
                <h2 class="modal-title">Application forms</h2>
                <p class="modal-subtitle">Form for fritidshem application</p>
              </div>
              <button @click="closeFormSettings" class="modal-close">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="settings-content">
              <div class="settings-header">
                <h3>Application form</h3>
                <button class="show-form-btn" @click="showCompleteApplicationForm">Show application form</button>
              </div>

              <div class="settings-table">
                <div class="setting-row">
                  <div class="setting-label">Name (internal)</div>
                  <div class="setting-value">Preschool Application</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Header</div>
                  <div class="setting-value">Preschool Application</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Who can submit an application</div>
                  <div class="setting-value">All</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Application can be changed by</div>
                  <div class="setting-value">Applicant and co applicant</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Applicant is always bill recipient</div>
                  <div class="setting-value">No</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Application for manual approval</div>
                  <div class="setting-value">All applications</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Max. (number of months) before desired startdate</div>
                  <div class="setting-value">-</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Minimum months before requested startdate</div>
                  <div class="setting-value">0</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Allowed dates for requested admissionstart</div>
                  <div class="setting-value">-</div>
                </div>
                <div class="setting-row">
                  <div class="setting-label">Number of allowed applications per child</div>
                  <div class="setting-value">Unlimited</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Template Editor Modal -->
        <div v-if="showTemplateEditorModal" class="modal-overlay" @click="closeTemplateEditor">
          <div class="modal-content large-modal template-editor-modal" @click.stop>
            <div class="modal-header">
              <div class="modal-title-section">
                <h2 class="modal-title">{{ editingTemplate ? 'Edit Template' : 'Create New Template' }}</h2>
                <p class="modal-subtitle">{{ editingTemplate ? 'Modify template structure and fields' : 'Build a custom form template with dynamic inputs' }}</p>
              </div>
              <button @click="closeTemplateEditor" class="modal-close">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="template-editor-content">
              <!-- Template Basic Info -->
              <div class="template-basic-info">
                <h3>Template Information</h3>
                <div class="template-info-fields">
                  <div class="field-group">
                    <label class="field-label">Template Name <span class="required">*</span></label>
                    <input
                      v-model="currentTemplate.name"
                      type="text"
                      class="field-input"
                      placeholder="e.g., Child Medical Information"
                      required
                    />
                  </div>
                  <div class="field-group">
                    <label class="field-label">Description</label>
                    <textarea
                      v-model="currentTemplate.description"
                      class="field-textarea"
                      placeholder="Brief description of what this template covers"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Form Fields Builder -->
              <div class="form-fields-builder">
                <div class="builder-header">
                  <h3>Form Fields</h3>
                  <button class="add-field-btn" @click="addFormField">
                    <i class="pi pi-plus"></i>
                    Add Field
                  </button>
                </div>

                <div class="fields-list">
                  <div
                    v-for="(field, index) in currentTemplate.fields"
                    :key="field.id"
                    class="field-item"
                  >
                    <div class="field-header">
                      <div class="field-number">{{ index + 1 }}</div>
                      <div class="field-main-info">
                        <input
                          v-model="field.label"
                          type="text"
                          class="field-label-input"
                          placeholder="Field Label"
                        />
                        <select v-model="field.type" class="field-type-select">
                          <option value="text">Text Input</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone Number</option>
                          <option value="date">Date Picker</option>
                          <option value="select">Dropdown</option>
                          <option value="radio">Radio Buttons</option>
                          <option value="checkbox">Checkbox Group</option>
                          <option value="textarea">Text Area</option>
                          <option value="number">Number</option>
                        </select>
                      </div>
                      <div class="field-actions">
                        <button class="field-action-btn" @click="toggleFieldRequired(field)">
                          <i :class="field.required ? 'pi pi-check text-green-600' : 'pi pi-times text-gray-400'"></i>
                        </button>
                        <button class="field-action-btn" @click="removeFormField(index)">
                          <i class="pi pi-trash text-red-500"></i>
                        </button>
                      </div>
                    </div>

                    <div class="field-details">
                      <div class="field-detail-row">
                        <input
                          v-model="field.placeholder"
                          type="text"
                          class="field-detail-input"
                          placeholder="Placeholder text"
                        />
                        <div class="field-required-toggle">
                          <label class="checkbox-label">
                            <input
                              type="checkbox"
                              v-model="field.required"
                            />
                            Required field
                          </label>
                        </div>
                      </div>

                      <!-- Options for select/dropdown, radio, and checkbox fields -->
                      <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" class="field-options">
                        <label class="field-label">
                          Options (one per line)
                          <span v-if="field.type === 'radio'" class="field-type-hint"> - User can select one</span>
                          <span v-if="field.type === 'checkbox'" class="field-type-hint"> - User can select multiple</span>
                          <span v-if="field.type === 'select'" class="field-type-hint"> - Dropdown menu</span>
                        </label>
                        <textarea
                          v-model="field.options"
                          class="field-options-textarea"
                          :placeholder="getOptionsPlaceholder(field.type)"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div v-if="currentTemplate.fields.length === 0" class="empty-fields-state">
                    <i class="pi pi-file text-gray-400 text-4xl"></i>
                    <h4>No fields added yet</h4>
                    <p>Click "Add Field" to start building your template</p>
                  </div>
                </div>
              </div>

              <!-- Preview Section -->
              <div class="template-preview-section">
                <h3>Template Preview</h3>
                <div class="preview-form">
                  <div
                    v-for="field in currentTemplate.fields"
                    :key="field.id"
                    class="preview-field"
                  >
                    <label class="preview-label">
                      {{ field.label }}
                      <span v-if="field.required" class="required">*</span>
                    </label>

                    <input
                      v-if="['text', 'email', 'phone', 'number'].includes(field.type)"
                      :type="field.type === 'phone' ? 'tel' : field.type"
                      class="preview-input"
                      :placeholder="field.placeholder"
                      disabled
                    />

                    <input
                      v-else-if="field.type === 'date'"
                      type="date"
                      class="preview-input"
                      disabled
                    />

                    <select
                      v-else-if="field.type === 'select'"
                      class="preview-input"
                      disabled
                    >
                      <option>{{ field.placeholder || 'Select an option' }}</option>
                      <option
                        v-for="option in getFieldOptions(field.options)"
                        :key="option"
                      >
                        {{ option }}
                      </option>
                    </select>

                    <div
                      v-else-if="field.type === 'radio'"
                      class="preview-radio-group"
                    >
                      <label
                        v-for="option in getFieldOptions(field.options)"
                        :key="option"
                        class="preview-radio-label"
                      >
                        <input type="radio" :name="field.id" disabled />
                        {{ option }}
                      </label>
                      <div v-if="getFieldOptions(field.options).length === 0" class="preview-no-options">
                        No options defined yet
                      </div>
                    </div>

                    <div
                      v-else-if="field.type === 'checkbox'"
                      class="preview-checkbox-group"
                    >
                      <label
                        v-for="option in getFieldOptions(field.options)"
                        :key="option"
                        class="preview-checkbox-label"
                      >
                        <input type="checkbox" disabled />
                        {{ option }}
                      </label>
                      <div v-if="getFieldOptions(field.options).length === 0" class="preview-no-options">
                        No options defined yet
                      </div>
                    </div>

                    <textarea
                      v-else-if="field.type === 'textarea'"
                      class="preview-textarea"
                      :placeholder="field.placeholder"
                      rows="3"
                      disabled
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Modal Actions -->
              <div class="template-editor-actions">
                <button class="preview-template-btn" @click="openFullTemplatePreview" :disabled="currentTemplate.fields.length === 0">
                  <i class="pi pi-eye"></i>
                  Preview Template
                </button>
                <button class="cancel-btn" @click="closeTemplateEditor">
                  Cancel
                </button>
                <button class="save-template-btn" @click="saveTemplate">
                  {{ editingTemplate ? 'Update Template' : 'Create Template' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Full Template Preview Modal -->
        <div v-if="showFullTemplatePreviewModal" class="modal-overlay" @click="closeFullTemplatePreview">
          <div class="modal-content extra-large-modal full-template-preview-modal" @click.stop>
            <div class="modal-header">
              <div class="modal-title-section">
                <h2 class="modal-title">Template Preview: {{ currentTemplate.name || 'Untitled Template' }}</h2>
                <p class="modal-subtitle">{{ currentTemplate.description || 'Preview how this template will look as a form' }}</p>
              </div>
              <button @click="closeFullTemplatePreview" class="modal-close">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="full-template-preview-content">
              <div class="template-form-preview">
                <div class="form-header">
                  <h3>{{ currentTemplate.name || 'Template Form' }}</h3>
                  <p v-if="currentTemplate.description">{{ currentTemplate.description }}</p>
                  <div class="form-stats">
                    <span class="stat-badge">{{ currentTemplate.fields.length }} fields</span>
                    <span class="stat-badge">{{ currentTemplate.fields.filter(f => f.required).length }} required</span>
                  </div>
                </div>

                <form class="preview-form-interactive" @submit.prevent>
                  <div
                    v-for="(field, index) in currentTemplate.fields"
                    :key="field.id"
                    class="form-field"
                  >
                    <label class="form-label">
                      {{ field.label || `Field ${index + 1}` }}
                      <span v-if="field.required" class="required">*</span>
                    </label>

                    <!-- Text inputs -->
                    <input
                      v-if="['text', 'email', 'phone', 'number'].includes(field.type)"
                      :type="field.type === 'phone' ? 'tel' : field.type"
                      class="form-input"
                      :placeholder="field.placeholder"
                      :required="field.required"
                    />

                    <!-- Date input -->
                    <input
                      v-else-if="field.type === 'date'"
                      type="date"
                      class="form-input"
                      :required="field.required"
                    />

                    <!-- Select dropdown -->
                    <select
                      v-else-if="field.type === 'select'"
                      class="form-select"
                      :required="field.required"
                    >
                      <option value="">{{ field.placeholder || 'Select an option' }}</option>
                      <option
                        v-for="option in getFieldOptions(field.options)"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>

                    <!-- Radio buttons -->
                    <div
                      v-else-if="field.type === 'radio'"
                      class="radio-group"
                    >
                      <label
                        v-for="option in getFieldOptions(field.options)"
                        :key="option"
                        class="radio-label"
                      >
                        <input
                          type="radio"
                          :name="`field_${field.id}`"
                          :value="option"
                          :required="field.required"
                        />
                        <span class="radio-text">{{ option }}</span>
                      </label>
                      <div v-if="getFieldOptions(field.options).length === 0" class="no-options">
                        <i class="pi pi-exclamation-triangle"></i>
                        No options configured for this radio button group
                      </div>
                    </div>

                    <!-- Checkbox group -->
                    <div
                      v-else-if="field.type === 'checkbox'"
                      class="checkbox-group"
                    >
                      <label
                        v-for="option in getFieldOptions(field.options)"
                        :key="option"
                        class="checkbox-label"
                      >
                        <input
                          type="checkbox"
                          :name="`field_${field.id}`"
                          :value="option"
                        />
                        <span class="checkbox-text">{{ option }}</span>
                      </label>
                      <div v-if="getFieldOptions(field.options).length === 0" class="no-options">
                        <i class="pi pi-exclamation-triangle"></i>
                        No options configured for this checkbox group
                      </div>
                    </div>

                    <!-- Textarea -->
                    <textarea
                      v-else-if="field.type === 'textarea'"
                      class="form-textarea"
                      :placeholder="field.placeholder"
                      rows="4"
                      :required="field.required"
                    ></textarea>
                  </div>

                  <!-- Form actions for preview -->
                  <div class="form-actions">
                    <button type="button" class="form-btn secondary">Save Draft</button>
                    <button type="submit" class="form-btn primary">Submit Application</button>
                  </div>
                </form>

                <!-- Form validation summary -->
                <div class="validation-summary">
                  <h4>Template Validation</h4>
                  <div class="validation-items">
                    <div class="validation-item success">
                      <i class="pi pi-check-circle"></i>
                      {{ currentTemplate.fields.length }} fields configured
                    </div>
                    <div class="validation-item" :class="currentTemplate.fields.filter(f => f.required).length > 0 ? 'success' : 'warning'">
                      <i :class="currentTemplate.fields.filter(f => f.required).length > 0 ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
                      {{ currentTemplate.fields.filter(f => f.required).length }} required fields
                    </div>
                    <div class="validation-item" :class="currentTemplate.fields.filter(f => ['select', 'radio', 'checkbox'].includes(f.type) && !f.options).length === 0 ? 'success' : 'error'">
                      <i :class="currentTemplate.fields.filter(f => ['select', 'radio', 'checkbox'].includes(f.type) && !f.options).length === 0 ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                      {{ currentTemplate.fields.filter(f => ['select', 'radio', 'checkbox'].includes(f.type) && !f.options).length === 0 ? 'All option fields have options' : `${currentTemplate.fields.filter(f => ['select', 'radio', 'checkbox'].includes(f.type) && !f.options).length} option fields missing options` }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preview actions -->
              <div class="full-preview-actions">
                <button class="edit-template-btn" @click="closeFullTemplatePreview">
                  <i class="pi pi-pencil"></i>
                  Continue Editing
                </button>
                <button class="save-and-close-btn" @click="saveAndCloseTemplate">
                  <i class="pi pi-check"></i>
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Complete Application Form Modal -->
        <div v-if="showCompleteFormModal" class="modal-overlay" @click="closeCompleteForm">
          <div class="modal-content extra-large-modal complete-form-modal" @click.stop>
            <div class="modal-header">
              <div class="modal-title-section">
                <h2 class="modal-title">{{ activeForm?.name || 'Application Form' }}</h2>
                <p class="modal-subtitle">Complete application form as it appears to guardians - {{ activeForm?.district }}</p>
              </div>
              <button @click="closeCompleteForm" class="modal-close">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="complete-form-content">
              <!-- Form Header -->
              <div class="application-form-header">
                <h3>{{ activeForm?.name }}</h3>
                <p class="form-description">{{ activeForm?.type }} application for {{ activeForm?.district }}</p>
                <div class="form-progress">
                  <div class="progress-item active">
                    <div class="progress-number">1</div>
                    <span>Basic Information</span>
                  </div>
                  <div class="progress-divider"></div>
                  <div class="progress-item">
                    <div class="progress-number">2</div>
                    <span>Additional Details</span>
                  </div>
                  <div class="progress-divider"></div>
                  <div class="progress-item">
                    <div class="progress-number">3</div>
                    <span>Review & Submit</span>
                  </div>
                </div>
              </div>

              <!-- Application Form Sections -->
              <div class="application-form-sections">
                <!-- Selected Templates as Form Sections -->
                <div
                  v-for="(template, index) in selectedTemplates"
                  :key="template.id"
                  class="form-section"
                >
                  <div class="section-header">
                    <h4>{{ template.name }}</h4>
                    <p v-if="template.description">{{ template.description }}</p>
                    <span class="section-badge">Section {{ index + 1 }}</span>
                  </div>

                  <div class="section-fields">
                    <div
                      v-for="field in template.fields"
                      :key="field.id"
                      class="application-field"
                    >
                      <label class="application-label">
                        {{ field.label }}
                        <span v-if="field.required" class="required">*</span>
                      </label>

                      <!-- Text inputs -->
                      <input
                        v-if="['text', 'email', 'phone', 'number'].includes(field.type)"
                        :type="field.type === 'phone' ? 'tel' : field.type"
                        class="application-input"
                        :placeholder="field.placeholder"
                        :required="field.required"
                      />

                      <!-- Date input -->
                      <input
                        v-else-if="field.type === 'date'"
                        type="date"
                        class="application-input"
                        :required="field.required"
                      />

                      <!-- Select dropdown -->
                      <select
                        v-else-if="field.type === 'select'"
                        class="application-select"
                        :required="field.required"
                      >
                        <option value="">{{ field.placeholder || 'Select an option' }}</option>
                        <option
                          v-for="option in getFieldOptions(field.options)"
                          :key="option"
                          :value="option"
                        >
                          {{ option }}
                        </option>
                      </select>

                      <!-- Radio buttons -->
                      <div
                        v-else-if="field.type === 'radio'"
                        class="application-radio-group"
                      >
                        <label
                          v-for="option in getFieldOptions(field.options)"
                          :key="option"
                          class="application-radio-label"
                        >
                          <input
                            type="radio"
                            :name="`${template.id}_${field.id}`"
                            :value="option"
                            :required="field.required"
                          />
                          <span class="radio-custom"></span>
                          <span class="radio-text">{{ option }}</span>
                        </label>
                      </div>

                      <!-- Checkbox group -->
                      <div
                        v-else-if="field.type === 'checkbox'"
                        class="application-checkbox-group"
                      >
                        <label
                          v-for="option in getFieldOptions(field.options)"
                          :key="option"
                          class="application-checkbox-label"
                        >
                          <input
                            type="checkbox"
                            :name="`${template.id}_${field.id}`"
                            :value="option"
                          />
                          <span class="checkbox-custom"></span>
                          <span class="checkbox-text">{{ option }}</span>
                        </label>
                      </div>

                      <!-- Textarea -->
                      <textarea
                        v-else-if="field.type === 'textarea'"
                        class="application-textarea"
                        :placeholder="field.placeholder"
                        rows="4"
                        :required="field.required"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="application-form-actions">
                  <button class="application-btn secondary">Save as Draft</button>
                  <button class="application-btn primary">Submit Application</button>
                </div>

                <!-- Guardian Data Preview -->
                <div class="guardian-data-preview">
                  <h4>Guardian Data Collection</h4>
                  <p>This form will collect the following data from guardians:</p>
                  <div class="collected-data-summary">
                    <div
                      v-for="template in selectedTemplates"
                      :key="template.id"
                      class="data-section"
                    >
                      <h5>{{ template.name }}</h5>
                      <ul class="data-fields">
                        <li
                          v-for="field in template.fields"
                          :key="field.id"
                          class="data-field"
                        >
                          <span class="field-name">{{ field.label }}</span>
                          <span class="field-type">{{ field.type }}</span>
                          <span v-if="field.required" class="field-required">Required</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Summary Modal -->
        <div v-if="showFormSummaryModal" class="modal-overlay" @click="closeFormSummary">
          <div class="modal-content summary-modal" @click.stop>
            <div class="modal-header">
              <div>
                <h2 class="modal-title">Application forms</h2>
                <p class="modal-subtitle">Form for {{ summaryForm?.type?.toLowerCase() }} application</p>
              </div>
              <button @click="closeFormSummary" class="modal-close">
                <i class="pi pi-times"></i>
              </button>
            </div>
            <div class="summary-tabs">
              <button class="summary-tab active">Application form</button>
              <button class="summary-tab" disabled>Show application form</button>
            </div>
            <div class="summary-table">
              <div class="summary-row"><div class="summary-label">Name (internal)</div><div class="summary-value">{{ summaryForm?.name }}</div></div>
              <div class="summary-row"><div class="summary-label">Header</div><div class="summary-value">{{ summaryForm?.name }}</div></div>
              <div class="summary-row"><div class="summary-label">Who can submit an application</div><div class="summary-value">All</div></div>
              <div class="summary-row"><div class="summary-label">Application can be changed by</div><div class="summary-value">Applicant and co applicant</div></div>
              <div class="summary-row"><div class="summary-label">Applicant is always bill recipient</div><div class="summary-value">No</div></div>
              <div class="summary-row"><div class="summary-label">Application for manual approval</div><div class="summary-value">All applications</div></div>
              <div class="summary-row"><div class="summary-label">Max. (number of months) before desired startdate</div><div class="summary-value">-</div></div>
              <div class="summary-row"><div class="summary-label">Minimum months before requested startdate</div><div class="summary-value">0</div></div>
              <div class="summary-row"><div class="summary-label">Allowed dates for requested admissionstart</div><div class="summary-value">-</div></div>
              <div class="summary-row"><div class="summary-label">Number of allowed applications per child</div><div class="summary-value">Unlimited</div></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import BaseLayout from '@/layouts/core/BaseLayout.vue'

interface ApplicationForm {
  id: string
  name: string
  type: string
  status: 'active' | 'draft'
  lastModified: string
  submissions: number
  templateCount: number
  totalTemplates: number
  district: string
}

interface Template {
  id: string
  name: string
  description: string
  inputCount: number
  fields: TemplateField[]
}

interface TemplateField {
  id: string
  label: string
  type: string
  placeholder: string
  required: boolean
  options?: string
}

type FormWithTemplates = ApplicationForm & { templates?: Template[] }

// Reactive state
const showAddFormModal = ref(false)
const showConfigureModal = ref(false)
const showTemplatePreviewModal = ref(false)
const showFormSettingsModal = ref(false)
const showTemplateEditorModal = ref(false)
const showFullTemplatePreviewModal = ref(false)
const editingTemplate = ref(false)
const selectedDistrict = ref('all')
const activeTab = ref('templates')
const activeForm = ref<ApplicationForm | null>(null)

const newForm = ref({
  name: '',
  type: '',
  district: ''
})

// Mock data for application forms
const applicationForms = ref<ApplicationForm[]>([
  {
    id: '1',
    name: 'Childcare Application',
    type: 'Förskola',
    status: 'active',
    lastModified: '2024-01-15',
    submissions: 245,
    templateCount: 3,
    totalTemplates: 5,
    district: 'centrum'
  },
  {
    id: '2',
    name: 'Preschool Application',
    type: 'Fritidshem',
    status: 'active',
    lastModified: '2024-01-12',
    submissions: 189,
    templateCount: 2,
    totalTemplates: 4,
    district: 'ostermalm'
  },
  {
    id: '3',
    name: 'Childcare Application',
    type: 'Förskola',
    status: 'draft',
    lastModified: '2024-01-10',
    submissions: 0,
    templateCount: 1,
    totalTemplates: 5,
    district: 'sodermalm'
  },
  {
    id: '4',
    name: 'Preschool Application',
    type: 'Fritidshem',
    status: 'active',
    lastModified: '2024-01-08',
    submissions: 156,
    templateCount: 4,
    totalTemplates: 4,
    district: 'norrmalm'
  }
])

// Mock template data
const availableTemplates = ref<Template[]>([
  {
    id: 't1',
    name: 'Basic Child Information',
    description: 'Essential information about the child',
    inputCount: 5,
    fields: []
  },
  {
    id: 't2',
    name: 'Guardian Information',
    description: 'Parent/Guardian contact details',
    inputCount: 8,
    fields: []
  },
  {
    id: 't3',
    name: 'Medical Information',
    description: 'Child health and medical needs',
    inputCount: 6,
    fields: []
  },
  {
    id: 't4',
    name: 'Emergency Contacts',
    description: 'Emergency contact information',
    inputCount: 4,
    fields: []
  }
])

const selectedTemplates = ref<Template[]>([
  {
    id: 't5',
    name: 'Application Details',
    description: 'Application preferences and requirements',
    inputCount: 7,
    fields: []
  }
])

// Computed properties
const filteredForms = computed(() => {
  if (selectedDistrict.value === 'all') {
    return applicationForms.value
  }
  return applicationForms.value.filter(form => form.district === selectedDistrict.value)
})

// Methods
const closeModal = () => {
  showAddFormModal.value = false
  newForm.value = {
    name: '',
    type: '',
    district: ''
  }
}

const createForm = () => {
  // Create new form logic
  const form: ApplicationForm = {
    id: Date.now().toString(),
    name: newForm.value.name,
    type: newForm.value.type,
    status: 'draft',
    lastModified: new Date().toISOString().split('T')[0],
    submissions: 0,
    templateCount: 0,
    totalTemplates: 5,
    district: newForm.value.district
  }

  applicationForms.value.unshift(form)
  closeModal()
}

const editForm = (form: ApplicationForm) => {
  activeForm.value = form
  showConfigureModal.value = true
  activeTab.value = 'templates'
}

const viewQuestions = (form: FormWithTemplates) => {
  // For demo, just use the first template (customize as needed)
  previewTemplate.value = (form.templates && form.templates.length > 0) ? form.templates[0] : selectedTemplates.value[0]
  showTemplatePreviewModal.value = true
}

const moveToSelected = (template: Template) => {
  const index = availableTemplates.value.findIndex(t => t.id === template.id)
  if (index > -1) {
    availableTemplates.value.splice(index, 1)
    selectedTemplates.value.push(template)
  }
}

const moveToAvailable = (template: Template) => {
  const index = selectedTemplates.value.findIndex(t => t.id === template.id)
  if (index > -1) {
    selectedTemplates.value.splice(index, 1)
    availableTemplates.value.push(template)
  }
}

const openTemplatePreview = () => {
  showTemplatePreviewModal.value = true
}

const closeConfigureModal = () => {
  showConfigureModal.value = false
  activeForm.value = null
}

const closeTemplatePreview = () => {
  showTemplatePreviewModal.value = false
  previewTemplate.value = null
}

const closeFormSettings = () => {
  showFormSettingsModal.value = false
  activeForm.value = null
}

const openTemplateEditor = () => {
  editingTemplate.value = false
  currentTemplate.value = {
    id: '',
    name: '',
    description: '',
    inputCount: 0,
    fields: []
  }
  showTemplateEditorModal.value = true
}

const closeTemplateEditor = () => {
  showTemplateEditorModal.value = false
  editingTemplate.value = false
  currentTemplate.value = {
    id: '',
    name: '',
    description: '',
    inputCount: 0,
    fields: []
  }
}

const currentTemplate = ref<Template>({
  id: '',
  name: '',
  description: '',
  inputCount: 0,
  fields: []
})

const addFormField = () => {
  const newField: TemplateField = {
    id: Date.now().toString(),
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    options: ''
  }
  currentTemplate.value.fields.push(newField)
}

const removeFormField = (index: number) => {
  currentTemplate.value.fields.splice(index, 1)
}

const toggleFieldRequired = (field: TemplateField) => {
  field.required = !field.required
}

const saveTemplate = async () => {
  if (editingTemplate.value) {
    // Update existing template
    const templateList = availableTemplates.value.find(t => t.id === currentTemplate.value.id) ?
      availableTemplates.value : selectedTemplates.value
    const index = templateList.findIndex(t => t.id === currentTemplate.value.id)
    if (index > -1) {
      templateList[index] = { ...currentTemplate.value, inputCount: currentTemplate.value.fields.length }
    }
  } else {
    // Create new template
    const newTemplate: Template = {
      ...currentTemplate.value,
      id: Date.now().toString(),
      inputCount: currentTemplate.value.fields.length
    }
    availableTemplates.value.push(newTemplate)

    // Save to database storage
    if (activeForm.value) {
      await saveTemplateToDatabase(newTemplate, activeForm.value.district, activeForm.value.type)
    }
  }
  closeTemplateEditor()
}

const editTemplate = (template: Template) => {
  editingTemplate.value = true
  currentTemplate.value = { ...template, fields: [...template.fields] }
  showTemplateEditorModal.value = true
}

const getOptionsPlaceholder = (type: string) => {
  switch (type) {
    case 'radio':
      return 'Option 1&#10;Option 2&#10;Option 3'
    case 'checkbox':
      return 'Checkbox option 1&#10;Checkbox option 2&#10;Checkbox option 3'
    default:
      return 'Option 1&#10;Option 2&#10;Option 3'
  }
}

const getFieldOptions = (options: string | undefined) => {
  if (!options) return []
  return options.split('\n').map(o => o.trim()).filter(o => o.length > 0)
}

const openFullTemplatePreview = () => {
  showFullTemplatePreviewModal.value = true
}

const closeFullTemplatePreview = () => {
  showFullTemplatePreviewModal.value = false
}

const saveAndCloseTemplate = () => {
  saveTemplate()
  closeFullTemplatePreview()
}

const showCompleteApplicationForm = () => {
  showCompleteFormModal.value = true
}

const showCompleteFormModal = ref(false)
const closeCompleteForm = () => {
  showCompleteFormModal.value = false
}

// Template Storage System - simulating database storage
interface StoredTemplate {
  id: string
  name: string
  description: string
  municipalityId: string
  formType: string
  fields: TemplateField[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface GuardianFormData {
  id: string
  guardianId: string
  formId: string
  municipalityId: string
  templateData: Record<string, string | string[]>
  submittedAt: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
}

// Mock database storage
const storedTemplates = ref<StoredTemplate[]>([])
const guardianSubmissions = ref<GuardianFormData[]>([])

const saveTemplateToDatabase = async (template: Template, municipalityId: string, formType: string) => {
  const storedTemplate: StoredTemplate = {
    ...template,
    municipalityId,
    formType,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Simulate API call to save template
  storedTemplates.value.push(storedTemplate)
  console.log('Template saved to database:', storedTemplate)
  return storedTemplate
}

const getTemplatesByMunicipality = (municipalityId: string, formType?: string) => {
  return storedTemplates.value.filter(template =>
    template.municipalityId === municipalityId &&
    template.isActive &&
    (!formType || template.formType === formType)
  )
}

const saveGuardianFormData = async (guardianId: string, formId: string, formData: Record<string, string | string[]>) => {
  const submission: GuardianFormData = {
    id: Date.now().toString(),
    guardianId,
    formId,
    municipalityId: activeForm.value?.district || '',
    templateData: formData,
    submittedAt: new Date().toISOString(),
    status: 'submitted'
  }

  guardianSubmissions.value.push(submission)
  console.log('Guardian form data saved:', submission)
  return submission
}

// 1. Add a new reactive state for the summary modal
const showFormSummaryModal = ref(false)
const summaryForm: Ref<ApplicationForm | null> = ref(null)

// 2. Add a function to open the summary modal
const openFormSummary = (form: ApplicationForm) => {
  summaryForm.value = form
  showFormSummaryModal.value = true
}
const closeFormSummary = () => {
  showFormSummaryModal.value = false
  summaryForm.value = null
}

// 3. Update the table row to open the summary modal on name click
// (Find the <td> for the form name and add @click="openFormSummary(form)" with a pointer cursor)
// Example:
// <td class="name-cell" @click="openFormSummary(form)" style="cursor:pointer;">{{ form.name }}</td>

// 4. Update the 'Show application form' button to open the same summary modal
// <button class="show-form-btn" @click="openFormSummary(activeForm)">Show application form</button>

// 5. Add the summary modal markup before the closing </template>:
// (This modal matches the first image: title, subtitle, summary table, close button)

// 6. Add CSS for the summary modal, tabs, and table to match the screenshots
// (Use .summary-modal, .summary-tabs, .summary-tab, .summary-table, .summary-row, .summary-label, .summary-value)

// 1. Add a new reactive state for the preview modal
const previewTemplate = ref<Template | null>(null)

</script>

<style scoped>
.application-forms-page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.add-form-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1e40af;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-form-btn:hover {
  background: #1d4ed8;
}

.content-area {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-section {
  display: flex;
  align-items: center;
}

.district-filter {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
}

.district-select {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.forms-table-container {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.forms-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: #16a085;
}

.table-header th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
}

.name-header {
  width: 35%;
}

.type-header {
  width: 15%;
}

.templates-header {
  width: 20%;
}

.change-header {
  width: 15%;
  text-align: center;
}

.questions-header {
  width: 15%;
  text-align: center;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row td {
  padding: 1rem 1.5rem;
  vertical-align: top;
  font-size: 0.875rem;
}

.form-name-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-name-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.form-name-link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  max-width: max-content;
}

.status-badge.active {
  background: #1f2937;
  color: white;
}

.status-badge.draft {
  background: #6b7280;
  color: white;
}

.form-meta {
  font-size: 0.75rem;
  color: #6b7280;
}

.template-count {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.template-count.complete {
  background: #1f2937;
  color: white;
}

.template-count.incomplete {
  background: #e5e7eb;
  color: #374151;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  border-radius: 0.25rem;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.modal-subtitle {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.field-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-wrapper {
  position: relative;
}

.field-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  background: white;
  cursor: pointer;
  appearance: none;
}

.field-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.create-btn {
  padding: 0.75rem 1.5rem;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover {
  background: #1d4ed8;
}

/* Configure Modal Specific */
.large-modal {
  max-width: 80rem;
  width: 90%;
}

.modal-title-section {
  flex: 1;
}

.modal-actions-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-config-header {
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-bottom: 1px solid #e2e8f0;
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.form-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #eff6ff;
}

/* Tab Content */
.tab-content {
  padding: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.section-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Template Management */
.template-management-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.minimize-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.minimize-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.template-management {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.template-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.template-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-header h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.add-template-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-template-btn:hover {
  background: #2563eb;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.template-card {
  background: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.template-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.drag-handle {
  color: #9ca3af;
  cursor: move;
}

.template-info {
  flex: 1;
}

.template-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.template-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.input-count {
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 500;
}

.template-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.template-action-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.template-action-btn:hover {
  color: #374151;
}

.template-management-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.preview-btn:hover {
  background: #059669;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.save-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #2563eb;
}

/* Template Preview Modal */
.template-preview-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.template-info-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.template-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.stat {
  padding: 0.25rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.stat.missing {
  background: #fed7aa;
  color: #c2410c;
}

.missing-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.warning-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.missing-tags {
  display: flex;
  gap: 0.5rem;
}

.missing-tag {
  padding: 0.25rem 0.75rem;
  background: #fed7aa;
  color: #c2410c;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.configured-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.success-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.input-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.input-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #dbeafe;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.input-details {
  flex: 1;
}

.input-details h5 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.input-details p {
  font-size: 0.875rem;
  color: #6b7280;
}

.input-meta {
  display: flex;
  gap: 0.5rem;
}

.required-badge {
  padding: 0.25rem 0.5rem;
  background: #fecaca;
  color: #b91c1c;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.input-type {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.preview-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.close-preview-btn {
  width: 100%;
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.close-preview-btn:hover {
  background: #4b5563;
}

/* Form Settings Modal */
.settings-modal {
  max-width: 60rem;
}

.settings-content {
  padding: 2rem;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.settings-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.show-form-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.show-form-btn:hover {
  background: #2563eb;
}

.settings-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.setting-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  flex: 1;
}

.setting-value {
  font-size: 0.875rem;
  color: #1f2937;
  flex: 1;
  text-align: right;
}

/* Settings Form */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

/* Access Content */
.access-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.access-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Schedule Content */
.schedule-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.schedule-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-range span {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Template Editor Modal */
.template-editor-modal {
  max-width: 90rem;
}

.template-editor-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-height: 80vh;
  overflow-y: auto;
}

.template-basic-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.template-info-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-fields-builder h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-field-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-field-btn:hover {
  background: #2563eb;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.field-item {
  background: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.field-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.field-number {
  background: #3b82f6;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.field-main-info {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field-label-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.field-type-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.field-actions {
  display: flex;
  gap: 0.5rem;
}

.field-action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.field-action-btn:hover {
  background: #e5e7eb;
}

.field-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-detail-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
}

.field-detail-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.field-required-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.field-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-options-textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
}

.template-preview-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.preview-form {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.preview-field {
  margin-bottom: 1rem;
}

.preview-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.preview-input, .preview-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: #f9fafb;
}

.preview-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.preview-radio-group,
.preview-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.preview-no-options {
  font-style: italic;
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 0.25rem;
  text-align: center;
}

.field-label .field-type-hint {
  font-weight: normal;
  color: #6b7280;
  font-size: 0.75rem;
}

.template-editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.save-template-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.save-template-btn:hover {
  background: #059669;
}

.empty-fields-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  text-align: center;
}

.empty-fields-state i {
  color: #9ca3af;
  font-size: 3rem;
}

.empty-fields-state h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.empty-fields-state p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Full Template Preview Modal */
.full-template-preview-modal {
  max-width: 80rem;
}

.full-template-preview-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.template-form-preview {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.form-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.preview-form-interactive {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input, .form-select, .form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.form-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.form-btn:hover {
  background: #f3f4f6;
}

.form-btn.secondary {
  background: none;
  color: #6b7280;
}

.form-btn.primary {
  background: #3b82f6;
  color: white;
}

.validation-summary {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.validation-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.validation-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.validation-item.success {
  color: #10b981;
}

.validation-item.warning {
  color: #f59e0b;
}

.validation-item.error {
  color: #ef4444;
}

.form-btn.primary:hover {
  background: #2563eb;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.radio-text,
.checkbox-text {
  user-select: none;
}

.no-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef3cd;
  border: 1px solid #f59e0b;
  border-radius: 0.375rem;
  color: #92400e;
  font-size: 0.875rem;
}

.validation-summary h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.full-preview-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.preview-template-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.preview-template-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.preview-template-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.edit-template-btn,
.save-and-close-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-template-btn {
  background: #6b7280;
  color: white;
}

.edit-template-btn:hover {
  background: #4b5563;
}

.save-and-close-btn {
  background: #10b981;
  color: white;
}

.save-and-close-btn:hover {
  background: #059669;
}

.extra-large-modal {
  max-width: 90vw;
  max-height: 90vh;
  width: 90vw;
}

.form-header {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.form-header p {
  color: #6b7280;
  margin-top: 0.25rem;
}

.application-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.form-progress {
  display: flex;
  align-items: center;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-right: 1rem;
}

.progress-number {
  background: #3b82f6;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.progress-divider {
  width: 1px;
  height: 1rem;
  background: #d1d5db;
}

.application-form-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.application-field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.application-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.application-input, .application-select, .application-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.application-radio-group, .application-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.application-radio-label, .application-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.application-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.application-btn:hover {
  background: #f3f4f6;
}

.application-btn.secondary {
  background: none;
  color: #6b7280;
}

.application-btn.primary {
  background: #3b82f6;
  color: white;
}

.guardian-data-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.collected-data-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.data-fields {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.field-type {
  font-size: 0.75rem;
  color: #6b7280;
}

.field-required {
  font-size: 0.75rem;
  color: #ef4444;
}

.complete-form-modal {
  max-width: 95vw;
  max-height: 95vh;
  width: 95vw;
}

.complete-form-content {
  padding: 2rem;
  max-height: 80vh;
  overflow-y: auto;
}

.application-form-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.form-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-item span {
  font-size: 0.875rem;
  color: #6b7280;
}

.progress-item.active span {
  color: #3b82f6;
  font-weight: 500;
}

.section-fields {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.application-field {
  margin-bottom: 1rem;
}

.application-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
}

.guardian-data-preview {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f0f9ff;
  border-radius: 0.5rem;
  border: 1px solid #e0f2fe;
}

.guardian-data-preview h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.guardian-data-preview p {
  color: #475569;
  margin: 0 0 1rem 0;
}

.data-section h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.data-fields {
  list-style: none;
  padding: 0;
  margin: 0;
}

.data-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.data-field:last-child {
  border-bottom: none;
}

.show-form-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.show-form-btn:hover {
  background: #2563eb;
}

.radio-custom,
.checkbox-custom {
  width: 1rem;
  height: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
}

.checkbox-custom {
  border-radius: 0.25rem;
}

.application-radio-label input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background: #3b82f6;
  border-radius: 50%;
}

.application-checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #3b82f6;
  font-weight: bold;
  font-size: 0.75rem;
}

/* Summary Modal */
.summary-modal {
  max-width: 60rem;
}

.summary-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.summary-tab {
  flex: 1;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.summary-tab.active {
  border-bottom: 2px solid #3b82f6;
  color: #3b82f6;
}

.summary-table {
  padding: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.summary-value {
  font-size: 0.875rem;
  color: #1f2937;
}

/* Preview Modal */
.preview-modal {
  max-width: 48rem;
  width: 100%;
  padding: 0;
}
.preview-body {
  padding: 2rem 2rem 0 2rem;
}
.template-info-card {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
}
.template-info-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}
.template-info-desc {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0.75rem;
}
.template-info-stats {
  display: flex;
  gap: 1rem;
}
.info-badge {
  background: #e0e7ff;
  color: #2563eb;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
}
.info-badge.missing {
  background: #e0e7ff;
  color: #6366f1;
}
.missing-required-box {
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  margin-bottom: 1.5rem;
}
.missing-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ea580c;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.missing-badges {
  display: flex;
  gap: 0.5rem;
}
.missing-pill {
  background: #fdba74;
  color: #7c2d12;
  border-radius: 1.5rem;
  padding: 0.35rem 1.1rem;
  font-size: 1rem;
  font-weight: 500;
}
.configured-inputs-card {
  background: #ecfdf5;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
}
.configured-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #059669;
  font-weight: 600;
  margin-bottom: 1rem;
}
.configured-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.configured-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #fff;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 1px 2px rgba(16,24,40,0.03);
}
.configured-icon {
  font-size: 1.5rem;
  color: #6366f1;
  background: #e0e7ff;
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.configured-details {
  flex: 1;
}
.configured-label {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 0.15rem;
}
.configured-desc {
  color: #64748b;
  font-size: 0.95rem;
}
.configured-meta {
  display: flex;
  gap: 0.5rem;
}
.meta-badge {
  background: #1e293b;
  color: #fff;
  border-radius: 1.5rem;
  padding: 0.25rem 0.9rem;
  font-size: 0.95rem;
  font-weight: 500;
}
.meta-badge.required {
  background: #1e293b;
  color: #fff;
}
.meta-badge.type {
  background: #f1f5f9;
  color: #1e293b;
}
.configured-empty {
  color: #64748b;
  font-size: 1rem;
  padding: 1rem 0;
  text-align: center;
}
.modal-footer {
  padding: 0 2rem 2rem 2rem;
  display: flex;
  justify-content: flex-end;
}
.close-btn {
  background: #64748b;
  color: #fff;
  border: 2px solid #64748b;
  border-radius: 0.5rem;
  padding: 0.75rem 2.5rem;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.close-btn:hover {
  background: #fff;
  color: #64748b;
}
</style>
