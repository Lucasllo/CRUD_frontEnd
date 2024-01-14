import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../user.service";

export const GENDERS = [
  { label: "Homem", value: "male" },
  { label: "Mulher", value: "feme" },
  { label: "Outro", value: "other" },
];
@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent {
  user: any = {};
  model: any = {};
  form = new FormGroup({});

  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      className: "d-flex align-content-center justify-content-center",
      fieldGroupClassName: "row",
      fieldGroup: [
        {
          key: "nome",
          type: "input",
          props: {
            label: "Nome",
            placeholder: "Primeiro Nome",
            required: true,
          },
        },
        {
          key: "sobrenome",
          type: "input",
          props: {
            label: "Sobrenome",
            placeholder: "Nome da Família",
            required: true,
          },
        },
        {
          key: "idade",
          type: "input",
          props: {
            label: "Idade",
            placeholder: "Idade",
            required: true,
          },
        },
        {
          key: "genero",
          type: "select",
          props: {
            label: "Genero",
            placeholder: "Genero",
            required: true,
            options: GENDERS,
          },
        },
      ],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.route.queryParams.subscribe(async (params: any): Promise<void> => {
      if (params.id !== undefined && params.id !== null) {
        this.user = await this.userService.get<any>({
          url: `http://localhost:3000/getUser/${params.id}`,
          params: {},
        });
        this.model = this.user;
      } else {
        this.model = {};
      }
    });
  }

  async onSubmit(): Promise<void> {
    let formData = new FormData();
    formData.append("nome", this.model.nome);
    formData.append("sobrenome", this.model.sobrenome);
    formData.append("idade", this.model.idade);
    formData.append("genero", this.model.genero);

    if (this.form.valid) {
      if (this.model?.id !== undefined && this.model?.id !== null) {
        this.user = await this.userService.put<any>({
          url: `http://localhost:3000/updateUser/${this.model?.id}`,
          params: {},
          data: this.model,
        });
      } else {
        delete this.model?.id;
        await this.userService.post<any>({
          url: `http://localhost:3000/addUser`,
          params: {},
          data: this.model,
        });
      }
    }
    await this.router.navigate(["/users"]);
  }
}
