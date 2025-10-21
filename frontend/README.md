# Proyecto

@negromate-alanfs-borrador3

# Es necesario hacer una mejoras en la calidad del codigo CSS del proyecto, en la carpeta ''frontend/src/css''

## Las mejoras son las siguientes:

1.- Avoid `@import` — 1 Rules
For performance reasons, @import should not be used in CSS. It blocks other downloads, like JS or images.

Discovered @import rules
Found 1 items.

2.- Declaration Duplications — 62.0% Declaration duplication
To keep filesize at a minimum, Declarations should not be repeated too often. A lot of duplicated Declarations are a sign that something could be abstracted away or pieces are possibly obsolete and need a cleanup.

Scoring high here means a lot of Declarations (combinations of the same Property and Value) are duplicated across the CSS:

/* The same declaration repeated several times */
.warning {
	font-size: 14px;
}

.small {
	font-size: 14;
}

.footer {
	font-size: 14px;
}

3.- Avoid complex selectors — 6 Complexity points at most
High complexity means that a Selector consists of several parts, each of which adds to the complexity of understanding what the Selector targets. Low complexity means that a Selector is easy to understand.

Your top complexity selectors:

.contact-form .form-group input:focus
.contact-form .form-group textarea:focus

4.- Todo el ''CSS media queries'' debe estar en la carpeta ''queries.css'', es decir, si encuentras codigo media queries en otro archivo CSS, debes mover el codigo al archivo correcto de queries.css.


# NOTA:  Tenemos que realizar los ajustes necesarios en el codigo de todo el proyecto si es necesario, para lograr estas mejoras de calidad en el CSS que te pido.